import React from 'react';
import { Cell } from '../Cell';
import type { BodyProps } from './types';

export const Body = <RecordType,>({
    data,
    columns,
    rowKey,
    fixedOffsets,
    isCellSelected,
    isCellActive,
    editingCell,
    editValue,
    tableRef,
    onCellMouseDown,
    onCellMouseEnter,
    onCellDoubleClick,
    onEditChange,
    onEditSave,
    onEditCancel
}: BodyProps<RecordType>) => {
    return (
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
                            const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;

                            return (
                                <Cell
                                    key={colKey}
                                    record={record}
                                    column={column}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                    fixedOffset={fixedOffsets[colIndex]}
                                    isSelected={isCellSelected(rowIndex, colIndex)}
                                    isActive={isCellActive(rowIndex, colIndex)}
                                    isEditing={isEditing}
                                    editValue={editValue}
                                    tableRef={tableRef}
                                    onMouseDown={(e) => onCellMouseDown(e, rowIndex, colIndex)}
                                    onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
                                    onDoubleClick={() => onCellDoubleClick(rowIndex, colIndex)}
                                    onEditChange={onEditChange}
                                    onEditSave={onEditSave}
                                    onEditCancel={onEditCancel}
                                />
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
};
