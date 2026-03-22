# UxTable 表格

高性能的 React 表格组件，专为大数据量与复杂交互设计。支持列排序、内联编辑、固定列、列宽拖拽调整、无限滚动加载、网格空位补齐，以及 Excel 级别的选区、复制粘贴与撤销重做功能。

## 基础用法

```tsx
import { useState } from 'react'
import { UxTable } from 'ux-table-react'
import 'ux-table-react/style.css'

const columns = [
  { title: '姓名', dataIndex: 'name', width: 100, editable: true },
  { title: '年龄', dataIndex: 'age', width: 100, sorter: true },
  { title: '地址', dataIndex: 'address', width: 200, editable: true }
];

const initialData = [
  { key: '1', name: '张三', age: 32, address: '西湖区湖底公园1号' },
  { key: '2', name: '李四', age: 42, address: '西湖区湖底公园2号' },
];

export default () => {
  const [data, setData] = useState(initialData)
  
  return (
    <div style={{ height: 400, width: '100%' }}>
      <UxTable 
        columns={columns} 
        data={data} 
        rowKey="key" 
        onDataChange={setData}
        recordNum={10} // 开启撤销重做支持，并记录 10 次历史
      />
    </div>
  )
}
```

## API

### UxTable Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列的配置描述 | `UxTableColumn[]` | - |
| data | 数据数组 | `any[]` | - |
| rowKey | 表格行 key 的取值 | `string \| ((record: any) => string)` | `'id'` |
| className | 类名 | `string` | - |
| style | 样式 | `CSSProperties` | - |
| onDataChange | 数据发生变化时的回调（如编辑、撤销、粘贴等） | `(newData: any[]) => void` | - |
| recordNum | 记录多少次操作记录（用于 ctrl+z/ctrl+y 撤销重做） | `number` | `5` (上限20) |
| gridConfig | 网格配置，如果指定了 rows 和 cols，会补齐空单元格，类似 Excel 画布 | `{ rows: number; cols: number; }` | - |
| infinite | 无限滚动配置，当快滚动到底部时扩充行列 | `{ row: number; col: number; gap: number }` | - |
| lineShow | 是否显示最左侧默认行号列 | `boolean` | `true` |
| isWorker | 是否开启 Web Worker 处理耗时任务（如大数据量复制粘贴） | `boolean` | `true` |

### UxTableColumn

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | `ReactNode` | - |
| dataIndex | 列数据在数据项中对应的 key | `string` | - |
| key | React key | `Key` | 默认使用 dataIndex |
| render | 自定义渲染函数 | `(value, record, index) => ReactNode` | - |
| width | 列宽度 | `number \| string` | - |
| resizable | 是否允许调整列宽 | `boolean` | `false` |
| editable | 是否可编辑 | `boolean` | `false` |
| sorter | 排序函数或布尔值（为 true 时使用内置排序） | `boolean \| ((a, b) => number)` | - |
| fixed | 冻结列（暂未完全实现吸附） | `'left' \| 'right'` | - |
