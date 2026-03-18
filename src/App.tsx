import React, { useState } from 'react';
import { UxTable } from './components/UxTable';
import type { UxTableColumn } from './components/UxTable/types';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const initialData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

function App() {
  const [data, setData] = useState(initialData);

  const columns: UxTableColumn<DataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      editable: true,
      sorter: (a, b) => a.age - b.age
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'key',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: () => <a href="#">Delete</a>,
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>UxTable Demo</h1>
      <div style={{ width: 600 }}>
        <UxTable<DataType[]> 
          columns={columns} 
          data={data} 
          rowKey="key"
          onDataChange={setData}
        />
      </div>
    </div>
  )
}

export default App

