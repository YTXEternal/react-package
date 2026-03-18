import React from 'react';
import type { UxTableColumn } from '../types';
import type { EditingState } from '../hooks/useEditing';
import { Cell } from './Cell';

interface BodyProps<DataSource extends unknown[]> {
    data: DataSource;
    columns: UxTableColumn<DataSource[number]>[];
    rowKey: string | ((record: DataSource[number]) => string) | undefined;
    fixedOffsets: { left?: number; right?: number; isLastLeft?: boolean; isFirstRight?: boolean }[];
    isCellSelected: (rowIndex: number, colIndex: number) => boolean;
    isCellActive: (rowIndex: number, colIndex: number) => boolean;
    editingCell: EditingState | null;
    editValue: string;
    tableRef: React.RefObject<HTMLDivElement | null>;
    onCellMouseDown: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void;
    onCellMouseEnter: (rowIndex: number, colIndex: number) => void;
    onCellDoubleClick: (rowIndex: number, colIndex: number, initialValue?: string) => void;
    onEditChange: (value: string) => void;
    onEditSave: () => void;
    onEditCancel: () => void;
}

export const Body = <DataSource extends unknown[]>({
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
}: BodyProps<DataSource>) => {
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
