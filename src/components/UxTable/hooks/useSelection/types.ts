export interface SelectionState {
    start: { row: number; col: number };
    end: { row: number; col: number };
}

export interface UseSelectionReturn {
    selection: SelectionState | null;
    setSelection: (state: SelectionState | null) => void;
    isSelecting: React.MutableRefObject<boolean>;
    handleCellMouseDown: (e: React.MouseEvent, rowIndex: number, colIndex: number, colCount: number, isLineNumberCol?: boolean) => void;
    handleCellMouseEnter: (rowIndex: number, colIndex: number, colCount: number, isLineNumberCol?: boolean) => void;
    handleColHeaderMouseDown: (e: React.MouseEvent, colIndex: number, rowCount: number) => void;
    handleColHeaderMouseEnter: (colIndex: number, rowCount: number) => void;
    isCellSelected: (rowIndex: number, colIndex: number) => boolean;
    isCellActive: (rowIndex: number, colIndex: number) => boolean;
}
