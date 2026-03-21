import type React from 'react';
import type { UxTableColumn } from '../../types';
import type { EditingState } from '../../hooks/useEditing/types';

export interface BodyProps<RecordType> {
    data: RecordType[];
    columns: UxTableColumn<RecordType>[];
    rowKey: string | ((record: RecordType) => string) | undefined;
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
