import { useState, useMemo } from 'react';
import type { UxTableColumn } from '../../types';
import { compareValues } from '../../utils/sort';
import type { SortState, UseSortingReturn } from './types';

export const useSorting = <DataSource extends unknown[]>(
    data: DataSource,
    columns: UxTableColumn<DataSource[number]>[]
): UseSortingReturn<DataSource> => {
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
        if (!column.sorter || !column.dataIndex) return data;
        
        const dataCopy = [...data] as DataSource;
        dataCopy.sort((a, b) => {
            const valA = (a as Record<string, unknown>)[column.dataIndex as string];
            const valB = (b as Record<string, unknown>)[column.dataIndex as string];
            
            // 提取空值判断：空值（null/undefined/空字符串）始终置于末尾
            const isNullA = valA === null || valA === undefined || valA === '';
            const isNullB = valB === null || valB === undefined || valB === '';

            if (isNullA && isNullB) return 0;
            if (isNullA) return 1;
            if (isNullB) return -1;

            let result = 0;
            if (typeof column.sorter === 'function') {
                result = column.sorter(a, b);
            } else {
                result = compareValues(valA, valB);
            }
            
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
