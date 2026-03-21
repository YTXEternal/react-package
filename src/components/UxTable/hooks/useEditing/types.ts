export interface EditingState {
    rowIndex: number;
    colIndex: number;
    initialValue?: string;
}

export interface UseEditingReturn {
    editingCell: EditingState | null;
    setEditingCell: (state: EditingState | null) => void;
    startEditing: (rowIndex: number, colIndex: number, initialValue?: string) => void;
    saveEdit: (value: string) => void;
}
