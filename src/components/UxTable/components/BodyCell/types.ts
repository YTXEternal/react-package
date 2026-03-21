import type React from 'react';
import type { UxTableColumn } from '../../types';

export interface BodyCellProps<RecordType> {
    rowIndex: number;
    colIndex: number;
    virtualStart: number;
    virtualSize: number;
    record: RecordType;
    value: unknown;
    column: UxTableColumn<RecordType>;
    isFixed: 'left' | 'right' | false | undefined;
    offset: { left?: number; right?: number; isLastLeft?: boolean; isFirstRight?: boolean } | undefined;
    isSelected: boolean;
    isActive: boolean;
    isEditing: boolean;
    isLineNumberCol: boolean;
    columnsLength: number;
    selectionBounds: { top: number; bottom: number; left: number; right: number } | null;
    isRowSelectionMode: boolean;
    
    // Ant properties
    isAntsTop: boolean;
    isAntsBottom: boolean;
    isAntsLeft: boolean;
    isAntsRight: boolean;
    isCut: boolean;

    // Handlers
    handleCellMouseDown: (e: React.MouseEvent, rowIndex: number, colIndex: number, colCount: number, isLineNumberCol: boolean) => void;
    handleCellMouseEnter: (rowIndex: number, colIndex: number, colCount: number, isLineNumberCol: boolean) => void;
    handleRowResizeMouseDown: (e: React.MouseEvent, rowIndex: number) => void;
    startEditing: (rowIndex: number, colIndex: number) => void;
    saveEdit: (value: string) => void;
    cancelEdit: () => void;
    initialEditValue: string;
}
