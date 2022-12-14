import { Table as Grid } from 'antd';

const Table = ({ columns, dataSource, pagination }: any) => {
  return (
    <Grid columns={columns} dataSource={dataSource} pagination={pagination} />
  );
};

export default Table;
