import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchGetRequestsWithPagination } from '../../utils/fetchServerRequests';
import Table from 'components/Table';
import Filters from 'components/LoggerFilters';
import './style.css';
import { Spin } from 'antd';

const Logger = () => {
  const [page, SetPage] = useState<number>(1);

  const [loggerFilter, setLoggerFilter] = useState<any>({
    logId: '',
    actionType: '',
    applicationType: '',
    applicationID: '',
    date: '',
  });

  const [recordsFiltered, setRecordsFiltered] = useState<any>([]);

  const {
    data: loggerData,
    isLoading,
    refetch: refetchAPIData,
  } = useQuery(
    ['loggerData', page],
    () =>
      fetchGetRequestsWithPagination(
        `https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f?page=${page}`
      ),
    {
      keepPreviousData: true,
      staleTime: 5000,
      onSuccess: (data) => setRecordsFiltered(data.auditLog),
    }
  );

  const handleFilterChange = (e: any) => {
    setLoggerFilter({
      ...loggerFilter,
      [e.target.name]: e.target.name === 'date' ? e : e.target.value,
    });
  };

  const handleSelectDate = (date: any) => {
    setLoggerFilter({
      ...loggerFilter,
      ['date']: date,
    });
  };

  const objectsAreSame = (x: any, y: any) => {
    var objectsAreSame = true;
    for (var propertyName in x) {
      if (x[propertyName] != y[propertyName]) {
        objectsAreSame = false;
        break;
      }
    }
    return objectsAreSame;
  };

  const getFilterParams = () => {
    let params: any = loggerFilter;
    let newObj: any = {};
    Object.keys(params).forEach((item: any) => {
      if (params[item]) {
        newObj[item] =
          typeof params[item] === 'string'
            ? params[item]
            : {
                startDate: params[item][0].toISOString().slice(0, 10),
                endDate: params[item][1].toISOString().slice(0, 10),
              }; // here the date key is differnt so we handle its params with custom validation
      }
    });
    return newObj;
  };

  const handlePagination = (page: number) => {
    SetPage(page);
  };

  const dateRange = (startDate: string, endDate: string, steps = 1) => {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const ItemsWithRange = loggerData?.auditLog.filter((item: any) => {
        if (
          item.creationTimestamp.slice(0, 10) ===
          new Date(currentDate).toISOString().slice(0, 10)
        ) {
          return item;
        }
      });
      setRecordsFiltered(ItemsWithRange);
      dateArray.push(new Date(currentDate).toISOString().slice(0, 10));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  };

  const onSubmitFilter = () => {
    setRecordsFiltered(loggerData.auditLog);
    const filterParams = getFilterParams();
    const filteredItems = loggerData?.auditLog.filter((item: any) => {
      const check = objectsAreSame(filterParams, item);
      if (check) {
        return item;
      }
    });

    // get items if the filter used by range date
    if (filterParams.date) {
      const { startDate, endDate } = filterParams.date;
      dateRange(startDate, endDate);
    }
    setRecordsFiltered(filteredItems);
  };

  const columns: any = [
    {
      title: 'Log ID',
      key: 'logId',
      render: (record: { logId: number }) => {
        return <span>{record.logId}</span>;
      },
      sorter: {
        compare: (a: any, b: any) => a.logId - b.logId,
        multiple: 1,
      },
    },
    {
      title: 'Application Type',
      key: 'applicationType',
      render: (record: { applicationType: string }) => {
        return <span>{record.applicationType}</span>;
      },
      sorter: (
        a: { applicationType: string },
        b: { applicationType: string }
      ) =>
        a.applicationType && b.applicationType
          ? a.applicationType.length - b.applicationType.length
          : a.applicationType && !b.applicationType
          ? a.applicationType.length
          : !a.applicationType && b.applicationType
          ? b.applicationType.length
          : '',
    },
    {
      title: 'Application ID',
      key: 'applicationId',
      render: (record: { applicationId: number }) => {
        return <span>{record.applicationId}</span>;
      },
      sorter: (a: { applicationId: number }, b: { applicationId: number }) =>
        a.applicationId && b.applicationId
          ? a.applicationId - b.applicationId
          : a.applicationId && !b.applicationId
          ? a.applicationId
          : !a.applicationId && b.applicationId
          ? b.applicationId
          : '',
    },
    {
      title: 'Action',
      key: 'actionType',
      render: (record: { actionType: string }) => {
        return <span>{record.actionType}</span>;
      },
      sorter: (a: { actionType: string }, b: { actionType: string }) =>
        a.actionType && b.actionType
          ? a.actionType.length - b.actionType.length
          : a.actionType && !b.actionType
          ? a.actionType.length
          : !a.actionType && b.actionType
          ? b.actionType.length
          : '',
    },
    {
      title: 'Action Details',
      key: 'actionDetails',
      render: (record: { actionDetails: string }) => {
        return (
          <span className='text-secondary'>
            {record.actionDetails ? record.actionDetails : '-/-'}
          </span>
        );
      },
      sorter: true,
    },
    {
      title: 'Date : Time',
      key: 'creationTimestamp',
      render: (record: { creationTimestamp: string }) => {
        return <span>{record.creationTimestamp}</span>;
      },
      sorter: true,
    },
  ];

  if (isLoading) {
    return (
      <div className='loading-wrapper'>
        <Spin size='large' />
      </div>
    );
  }
  return (
    <div className='logger-wrapper'>
      <Filters
        loggerFilter={loggerFilter}
        handleFilterChange={handleFilterChange}
        onSubmitFilter={onSubmitFilter}
        handleSelectDate={handleSelectDate}
      />
      <Table
        columns={columns}
        dataSource={recordsFiltered}
        pagination={{
          position: ['bottomCenter'],
          total: recordsFiltered.length < 10 ? 1 : loggerData?.recordsFiltered,
          onChange: (page: number) => handlePagination(page),
        }}
      />
    </div>
  );
};

export default Logger;
