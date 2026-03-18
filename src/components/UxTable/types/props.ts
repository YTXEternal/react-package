import type { ReactNode, CSSProperties, Key } from 'react';

export interface UxTableColumn<RecordType> {
  /**
   * 列头显示文字
   */
  title: ReactNode;
  /**
   * 列数据在数据项中对应的 key
   */
  dataIndex: keyof RecordType;
  /**
   * React key，默认使用 dataIndex
   */
  key?: Key;
  /**
   * 自定义渲染函数
   */
  render?: (value: unknown, record: RecordType, index: number) => ReactNode;
  /**
   * 列宽度
   */
  width?: number | string;
}

export interface UxTableProps<DataSource extends unknown[]> {
  /**
   * 表格列的配置描述
   */
  columns: UxTableColumn<DataSource[number]>[];
  /**
   * 数据数组
   */
  data: DataSource;
  /**
   * 表格行 key 的取值，可以是字符串或一个函数
   */
  rowKey?: string | ((record: DataSource[number]) => string);
  /**
   * 类名
   */
  className?: string;
  /**
   * 样式
   */
  style?: CSSProperties;
}
