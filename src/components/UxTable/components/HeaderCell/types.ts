import type React from 'react';
import type { UxTableColumn } from '../../types';

export interface HeaderCellProps<RecordType> {
    index: number;
    column: UxTableColumn<RecordType>;
    virtualStart: number;
    virtualSize: number;
    isFixed: 'left' | 'right' | false | undefined;
    offset: { left?: number; right?: number; isLastLeft?: boolean; isFirstRight?: boolean } | undefined;
    sortOrder: 'asc' | 'desc' | undefined;
    isSorted: boolean;
    dataLength: number;
    handleColHeaderMouseDown: (e: React.MouseEvent, index: number, dataLength: number) => void;
    handleColHeaderMouseEnter: (index: number, dataLength: number) => void;
    handleSort: (index: number) => void;
    handleResizeMouseDown: (e: React.MouseEvent, index: number) => void;
}
