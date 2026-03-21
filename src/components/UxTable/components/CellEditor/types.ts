export interface CellEditorProps {
    initialValue: string;
    onSave: (value: string) => void;
    onCancel: () => void;
}
