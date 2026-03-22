# 快速开始

## 安装

推荐使用 `pnpm` 安装：

```bash
pnpm add ux-table-react
```

## 使用

引入组件及其样式文件即可：

```tsx
import { useState } from 'react'
import { UxTable } from 'ux-table-react'
import 'ux-table-react/style.css'

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120, editable: true },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 100, sorter: true },
  { title: '住址', dataIndex: 'address', key: 'address', width: 250 },
];

const initialData = [
  { key: '1', name: '张三', age: 32, address: '西湖区湖底公园1号' },
  { key: '2', name: '李四', age: 42, address: '西湖区湖底公园2号' },
];

function App() {
  const [data, setData] = useState(initialData)

  return (
    <div style={{ height: 400, width: '100%' }}>
      <UxTable 
        columns={columns} 
        data={data} 
        rowKey="key"
        onDataChange={setData} 
      />
    </div>
  )
}

export default App
```
