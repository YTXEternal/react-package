import React, { useRef } from 'react';
import type { UxTableProps } from './types';
import { useResizing } from './hooks/useResizing';
import { useSorting } from './hooks/useSorting';
import { useSelection } from './hooks/useSelection';
import { useEditing } from './hooks/useEditing';
import { useFixedColumns } from './hooks/useFixedColumns';
import { Header } from './modules/Header';
import { Body } from './modules/Body';

export const UxTable = <DataSource extends unknown[]>(props: UxTableProps<DataSource>) => {
    const { columns: propColumns, data, rowKey, className, style, onDataChange } = props;
    const tableRef = useRef<HTMLDivElement>(null);

    // Hooks
    const { columns, handleResizeMouseDown } = useResizing(propColumns);
    const { sortState, handleSort, sortedData } = useSorting(data, columns);
    const { 
        selection, 
        setSelection, 
        handleCellMouseDown, 
        handleCellMouseEnter, 
        isCellSelected, 
        isCellActive 
    } = useSelection(tableRef);
    const { 
        editingCell, 
        setEditingCell, 
        editValue, 
        setEditValue, 
        startEditing, 
        saveEdit 
    } = useEditing(data, columns, sortedData, onDataChange);
    const fixedOffsets = useFixedColumns(columns);

    // Keyboard & Paste Handlers
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (editingCell) return; // Handled in Cell input

        if (!selection) return;

        const { start } = selection;
        const currentRow = start.row;
        const currentCol = start.col;

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newRow = Math.max(0, currentRow - 1);
            setSelection({ start: { row: newRow, col: currentCol }, end: { row: newRow, col: currentCol } });
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newRow = Math.min(sortedData.length - 1, currentRow + 1);
            setSelection({ start: { row: newRow, col: currentCol }, end: { row: newRow, col: currentCol } });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const newCol = Math.max(0, currentCol - 1);
            setSelection({ start: { row: currentRow, col: newCol }, end: { row: currentRow, col: newCol } });
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const newCol = Math.min(columns.length - 1, currentCol + 1);
            setSelection({ start: { row: currentRow, col: newCol }, end: { row: currentRow, col: newCol } });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            startEditing(currentRow, currentCol);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // Direct input
            startEditing(currentRow, currentCol, e.key);
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            handleCopy();
        }
    };

    const handleCopy = () => {
        if (!selection) return;
        const r1 = Math.min(selection.start.row, selection.end.row);
        const r2 = Math.max(selection.start.row, selection.end.row);
        const c1 = Math.min(selection.start.col, selection.end.col);
        const c2 = Math.max(selection.start.col, selection.end.col);

        const rows = [];
        for (let i = r1; i <= r2; i++) {
            const rowData = [];
            const record = sortedData[i] as Record<string, unknown>;
            for (let j = c1; j <= c2; j++) {
                const val = record[columns[j].dataIndex as string];
                rowData.push(val ?? '');
            }
            rows.push(rowData.join('\t'));
        }
        navigator.clipboard.writeText(rows.join('\n'));
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (!selection || !onDataChange) return;
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const rows = text.split(/\r\n|\n|\r/).filter(row => row.length > 0);
        
        const startRow = Math.min(selection.start.row, selection.end.row);
        const startCol = Math.min(selection.start.col, selection.end.col);

        const newData = [...data] as DataSource;
        let changed = false;

        rows.forEach((rowStr, rIdx) => {
            const targetRowIdx = startRow + rIdx;
            if (targetRowIdx >= sortedData.length) return;
            
            const cells = rowStr.split('\t');
            const record = sortedData[targetRowIdx];
            const originalIndex = data.indexOf(record);
            if (originalIndex === -1) return;

            const newRecord = { ...data[originalIndex] as object };
            
            cells.forEach((cellStr, cIdx) => {
                const targetColIdx = startCol + cIdx;
                if (targetColIdx >= columns.length) return;
                
                const column = columns[targetColIdx];
                if (column.editable !== false) {
                    (newRecord as Record<string, unknown>)[column.dataIndex as string] = cellStr;
                    changed = true;
                }
            });
            newData[originalIndex] = newRecord as DataSource[number];
        });

        if (changed) {
            onDataChange(newData);
        }
    };

    return (
        <div 
            ref={tableRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            style={{ 
                overflowX: 'auto', 
                position: 'relative', 
                borderTop: '1px solid #e8e8e8', 
                borderLeft: '1px solid #e8e8e8',
                outline: 'none'
            }}
        >
            <table className={className} style={{ ...style, tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0, width: '100%', userSelect: 'none' }}>
                <Header 
                    columns={columns}
                    sortState={sortState}
                    fixedOffsets={fixedOffsets}
                    onSort={handleSort}
                    onResizeMouseDown={handleResizeMouseDown}
                />
                <Body
                    data={sortedData}
                    columns={columns}
                    rowKey={rowKey}
                    fixedOffsets={fixedOffsets}
                    isCellSelected={isCellSelected}
                    isCellActive={isCellActive}
                    editingCell={editingCell}
                    editValue={editValue}
                    tableRef={tableRef}
                    onCellMouseDown={handleCellMouseDown}
                    onCellMouseEnter={handleCellMouseEnter}
                    onCellDoubleClick={startEditing}
                    onEditChange={setEditValue}
                    onEditSave={saveEdit}
                    onEditCancel={() => {
                        setEditingCell(null);
                        tableRef.current?.focus();
                    }}
                />
            </table>
        </div>
    );
};
