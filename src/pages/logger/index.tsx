import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchGetRequestsWithPagination } from '../../utils/fetchServerRequests';
import Table from 'components/Table';
import Filters from 'components/LoggerFilters';
import './style.css';

const Logger = () => {
  const [page, SetPage] = useState<number>(1);
  const [loggerFilter, setLoggerFilter] = useState<any>({
    logId: '',
    ActionType: '',
    applicationType: '',
    applicationID: '',
    date: '',
  });

  const handleFilterChange = (e: any) => {
    setLoggerFilter({
      ...loggerFilter,
      [e.target.name]: e.target.name === 'date' ? e : e.target.value,
    });
  };

  const handleSelectDate = (date: any) =>
    setLoggerFilter({
      ...loggerFilter,
      ['date']: date,
    });

  const { data: loggerData, refetch: refetchAPIData } = useQuery(
    ['loggerData', page],
    () =>
      fetchGetRequestsWithPagination(
        getFilterParams()
          ? `https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f?page=${page}&${getFilterParams()}`
          : `https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f?page=${page}`
      ),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const columns: any = [
    {
      title: 'Log ID',
      key: 'logId',
      render: (record: { logId: number }) => {
        return <span>{record.logId}</span>;
      },
      sorter: true,
    },
    {
      title: 'Application Type',
      key: 'applicationType',
      render: (record: { applicationType: string }) => {
        return <span>{record.applicationType}</span>;
      },
      sorter: true,
    },
    {
      title: 'Application ID',
      key: 'applicationId',
      render: (record: { applicationId: number }) => {
        return <span>{record.applicationId}</span>;
      },
      sorter: true,
    },
    {
      title: 'Action',
      key: 'actionType',
      render: (record: { actionType: string }) => {
        return <span>{record.actionType}</span>;
      },
      sorter: true,
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

  // responsible for get the filled filter snd convert its value to query string
  const getFilterParams = () => {
    let params: any = loggerFilter;
    let newObj: any = {};
    Object.keys(params).forEach((item: any) => {
      if (params[item]) {
        newObj[item] =
          typeof params[item] === 'string' ? params[item] : params[item].value;
      }
    });

    const queryString = new URLSearchParams(newObj).toString();
    if (queryString.length > 0) {
      return queryString;
    }
  };

  const handlePagination = (page: number) => {
    SetPage(page);
  };

  const onSubmitFilter = () => {
    // reftech the api again with filled filter
    refetchAPIData();
  };

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
        dataSource={loggerData?.auditLog}
        pagination={{
          position: ['bottomCenter'],
          total: loggerData?.recordsFiltered,
          onChange: (page: number) => handlePagination(page),
        }}
      />
    </div>
  );
};

export default Logger;
