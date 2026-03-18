import React from 'react';
import type { UxTableProps } from './types';

export const UxTable = <DataSource extends unknown[]>(props: UxTableProps<DataSource>) => {
    const { columns, data, rowKey, className, style } = props;

    return (
        <table className={className} style={style}>
            <thead>
                <tr>
                    {columns.map((column, index) => {
                        const key = column.key || String(column.dataIndex) || index;
                        return (
                            <th key={key} style={column.width ? { width: column.width } : undefined}>
                                {column.title}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map((record, rowIndex) => {
                    let key: React.Key = rowIndex;
                    if (typeof rowKey === 'function') {
                        key = rowKey(record);
                    } else if (typeof rowKey === 'string') {
                        key = (record as Record<string, unknown>)[rowKey] as React.Key;
                    }

                    return (
                        <tr key={key}>
                            {columns.map((column, colIndex) => {
                                const colKey = column.key || String(column.dataIndex) || colIndex;
                                const value = (record as Record<keyof DataSource[number], unknown>)[column.dataIndex];
                                return (
                                    <td key={colKey}>
                                        {column.render
                                            ? column.render(value, record, rowIndex)
                                            : (value as React.ReactNode)}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
