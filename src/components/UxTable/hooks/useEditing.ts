import { useState } from 'react';
import type { UxTableColumn } from '../types';

export interface EditingState {
    rowIndex: number;
    colIndex: number;
}

export const useEditing = <DataSource extends unknown[]>(
    data: DataSource,
    columns: UxTableColumn<DataSource[number]>[],
    sortedData: DataSource,
    onDataChange?: (newData: DataSource) => void
) => {
    const [editingCell, setEditingCell] = useState<EditingState | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    const startEditing = (rowIndex: number, colIndex: number, initialValue?: string) => {
        const column = columns[colIndex];
        if (column.editable === false) return;
        
        const record = sortedData[rowIndex];
        const value = (record as Record<string, unknown>)[column.dataIndex as string];
        
        setEditingCell({ rowIndex, colIndex });
        setEditValue(initialValue !== undefined ? initialValue : String(value ?? ''));
    };

    const saveEdit = () => {
        if (editingCell && onDataChange) {
            const { rowIndex, colIndex } = editingCell;
            const column = columns[colIndex];
            const newData = [...data] as DataSource;
            
            const record = sortedData[rowIndex];
            const originalIndex = data.indexOf(record);
            
            if (originalIndex !== -1) {
                 const newRecord = { ...data[originalIndex] as object };
                 (newRecord as Record<string, unknown>)[column.dataIndex as string] = editValue;
                 newData[originalIndex] = newRecord as DataSource[number];
                 onDataChange(newData);
            }
        }
        setEditingCell(null);
    };

    return {
        editingCell,
        setEditingCell,
        editValue,
        setEditValue,
        startEditing,
        saveEdit
    };
};
