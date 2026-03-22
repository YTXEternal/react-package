import type { UxTableColumn } from '../../types';

export interface UseResizingReturn<RecordType> {
    columns: UxTableColumn<RecordType>[];
    handleResizeMouseDown: (e: React.MouseEvent, index: number) => void;
}
