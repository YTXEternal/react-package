import { useState } from 'react';
import type { UxTableColumn } from '../../types';
import type { EditingState, UseEditingReturn } from './types';

export const useEditing = <DataSource extends unknown[]>(
    data: DataSource,
    columns: UxTableColumn<DataSource[number]>[],
    sortedData: DataSource,
    onDataChange?: (newData: DataSource) => void
): UseEditingReturn => {
    const [editingCell, setEditingCell] = useState<EditingState | null>(null);

    const startEditing = (rowIndex: number, colIndex: number, initialValue?: string) => {
        const column = columns[colIndex];
        if (column.editable === false) return;
        
        setEditingCell({ rowIndex, colIndex, initialValue });
    };

    const saveEdit = (value: string) => {
        if (editingCell && onDataChange) {
            const { rowIndex, colIndex } = editingCell;
            const column = columns[colIndex];
            const newData = [...data] as DataSource;
            
            const record = sortedData[rowIndex];
            const originalIndex = data.indexOf(record);
            
            if (originalIndex !== -1 && column.dataIndex) {
                 const newRecord = { ...data[originalIndex] as object };
                 (newRecord as Record<string, unknown>)[column.dataIndex as string] = value;
                 newData[originalIndex] = newRecord as DataSource[number];
                 onDataChange(newData);
            }
        }
        setEditingCell(null);
    };

    return {
        editingCell,
        setEditingCell,
        startEditing,
        saveEdit
    };
};
