import { useState, useMemo } from 'react';
import type { UxTableColumn } from '../types';

export interface SortState {
    colIndex: number;
    order: 'asc' | 'desc';
}

export const useSorting = <DataSource extends unknown[]>(
    data: DataSource,
    columns: UxTableColumn<DataSource[number]>[]
) => {
    const [sortState, setSortState] = useState<SortState | null>(null);

    const handleSort = (index: number) => {
        const column = columns[index];
        if (!column.sorter) return;

        setSortState(prev => {
            if (prev?.colIndex === index) {
                if (prev.order === 'asc') return { colIndex: index, order: 'desc' };
                return null;
            }
            return { colIndex: index, order: 'asc' };
        });
    };

    const sortedData = useMemo(() => {
        if (!sortState) return data;
        const column = columns[sortState.colIndex];
        if (!column.sorter) return data;
        
        const dataCopy = [...data] as DataSource;
        dataCopy.sort((a, b) => {
            const result = column.sorter!(a as DataSource[number], b as DataSource[number]);
            return sortState.order === 'asc' ? result : -result;
        });
        return dataCopy;
    }, [data, sortState, columns]);

    return {
        sortState,
        handleSort,
        sortedData
    };
};
