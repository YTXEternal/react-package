import { useMemo } from 'react';
import type { UxTableColumn } from '../types';

export const useFixedColumns = <DataSource extends unknown[]>(
    columns: UxTableColumn<DataSource[number]>[]
) => {
    return useMemo(() => {
        let leftOffset = 0;
        let rightOffset = 0;
        const offsets: { left?: number; right?: number; isLastLeft?: boolean; isFirstRight?: boolean }[] = [];

        let lastLeftIndex = -1;
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            if (col.fixed === 'left') {
                offsets[i] = { left: leftOffset };
                leftOffset += (typeof col.width === 'number' ? col.width : parseInt(col.width as string, 10) || 100);
                lastLeftIndex = i;
            }
        }
        if (lastLeftIndex !== -1) offsets[lastLeftIndex].isLastLeft = true;

        let firstRightIndex = -1;
        for (let i = columns.length - 1; i >= 0; i--) {
            const col = columns[i];
            if (col.fixed === 'right') {
                offsets[i] = { ...offsets[i], right: rightOffset };
                rightOffset += (typeof col.width === 'number' ? col.width : parseInt(col.width as string, 10) || 100);
                firstRightIndex = i;
            }
        }
        if (firstRightIndex !== -1) offsets[firstRightIndex].isFirstRight = true;

        return offsets;
    }, [columns]);
};
