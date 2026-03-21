import type React from 'react';
import type { UxTableColumn } from '../../types';
import type { SortState } from '../../hooks/useSorting/types';

export interface HeaderProps<RecordType> {
    columns: UxTableColumn<RecordType>[];
    sortState: SortState | null;
    fixedOffsets: { left?: number; right?: number; isLastLeft?: boolean; isFirstRight?: boolean }[];
    onSort: (index: number) => void;
    onResizeMouseDown: (e: React.MouseEvent, index: number) => void;
}
