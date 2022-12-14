import { Input } from 'antd';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

type Props = {
  handleFilterChange: (e: any) => void;
  handleSelectDate: (e: any) => void;
  onSubmitFilter: () => void;
  loggerFilter: any;
};

const Filters = ({
  loggerFilter,
  handleFilterChange,
  handleSelectDate,
  onSubmitFilter,
}: Props) => {
  return (
    <div className='filter-wrapper'>
      <div className='filter'>
        <label htmlFor='logId'>Log ID</label>
        <Input
          placeholder='Enter log id'
          name='logId'
          value={loggerFilter.logId}
          onChange={handleFilterChange}
        />
      </div>
      <div className='filter'>
        <label htmlFor='ActionType'>Action Type</label>
        <Input
          placeholder='Enter application type'
          name='ActionType'
          value={loggerFilter.ActionType}
          onChange={handleFilterChange}
        />
      </div>
      <div className='filter'>
        <label htmlFor='applicationType'>Application Type</label>
        <Input
          placeholder='Enter application type'
          name='applicationType'
          value={loggerFilter.applicationType}
          onChange={handleFilterChange}
        />
      </div>
      <div className='filter'>
        <label htmlFor='applicationType'>Select date</label>
        <RangePicker
          value={loggerFilter.date}
          onChange={handleSelectDate}
          format='YYYY/MM/DD'
        />
      </div>
      <div className='filter'>
        <label htmlFor='applicationId'>Application ID</label>
        <Input
          placeholder='Enter application id'
          name='applicationId'
          value={loggerFilter.applicationId}
          onChange={handleFilterChange}
        />
      </div>
      <div className='submit-wrapper'>
        <button type='button' onClick={onSubmitFilter} className='btn'>
          Search Logger
        </button>
      </div>
    </div>
  );
};

export default Filters;
