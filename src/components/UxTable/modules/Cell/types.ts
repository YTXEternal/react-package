import type React from 'react';
import type { UxTableColumn } from '../../types';

export interface CellProps<RecordType> {
    record: RecordType;
    column: UxTableColumn<RecordType>;
    rowIndex: number;
    colIndex: number;
    fixedOffset?: { left?: number; right?: number; isLastLeft?: boolean; isFirstRight?: boolean };
    isSelected: boolean;
    isActive: boolean;
    isEditing: boolean;
    editValue: string;
    tableRef: React.RefObject<HTMLDivElement | null>;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onDoubleClick: () => void;
    onEditChange: (value: string) => void;
    onEditSave: () => void;
    onEditCancel: () => void;
}
