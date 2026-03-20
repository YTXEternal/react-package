export const processCopy = (
    selectedData: Record<string, unknown>[], 
    columns: { key?: string | number | symbol; dataIndex: string | number | symbol }[]
) => {
    const rows: string[] = [];
    for (let i = 0; i < selectedData.length; i++) {
        const rowData: string[] = [];
        const record = selectedData[i];
        for (let j = 0; j < columns.length; j++) {
            if (columns[j].key === '_line_number_') continue;
            const val = record[columns[j].dataIndex as string];
            rowData.push(val !== null && val !== undefined ? String(val) : '');
        }
        if (rowData.length > 0) {
            rows.push(rowData.join('\t'));
        }
    }
    return rows.join('\n');
};

export const processDelete = (
    finalData: Record<string, unknown>[],
    sortedData: Record<string, unknown>[],
    columns: { editable?: boolean; dataIndex: string | number | symbol; key?: string | number | symbol }[],
    bounds: { top: number; bottom: number; left: number; right: number }
) => {
    const newData = [...finalData];
    let changed = false;

    for (let rIdx = bounds.top; rIdx <= bounds.bottom; rIdx++) {
        const record = sortedData[rIdx];
        const originalIndex = finalData.indexOf(record);
        if (originalIndex === -1) continue; // 卫语句：找不到原数据索引跳过

        const newRecord = { ...newData[originalIndex] };
        for (let cIdx = bounds.left; cIdx <= bounds.right; cIdx++) {
            const column = columns[cIdx];
            if (column.editable === false || column.key === '_line_number_') continue; // 卫语句：不可编辑或行号列跳过

            newRecord[column.dataIndex as string] = null;
            changed = true;
        }
        newData[originalIndex] = newRecord;
    }

    if (!changed) return null;
    return { newData };
};

export const processPasteParse = (text: string) => {
    const rows = text.split(/\r\n|\n|\r/).filter((row: string) => row.length > 0);
    return rows.map((row: string) => row.split('\t'));
};

export const processPaste = (
    text: string,
    finalData: Record<string, unknown>[],
    sortedData: Record<string, unknown>[],
    columns: { editable?: boolean; dataIndex: string | number | symbol; key?: string | number | symbol }[],
    startRow: number,
    startCol: number,
    cutBounds?: { top: number; bottom: number; left: number; right: number } | null
) => {
    const parsedRows = processPasteParse(text);
    if (!parsedRows || parsedRows.length === 0) {
        return null;
    }

    const newData = [...finalData];
    let changed = false;

    if (cutBounds) {
        for (let rIdx = cutBounds.top; rIdx <= cutBounds.bottom; rIdx++) {
            const record = sortedData[rIdx];
            const originalIndex = finalData.indexOf(record);
            if (originalIndex !== -1) {
                const newRecord = { ...newData[originalIndex] };
                for (let cIdx = cutBounds.left; cIdx <= cutBounds.right; cIdx++) {
                    const column = columns[cIdx];
                    if (column.editable === false || column.key === '_line_number_') continue;
                    newRecord[column.dataIndex as string] = null;
                    changed = true;
                }
                newData[originalIndex] = newRecord;
            }
        }
    }

    let maxRowIdx = startRow;
    let maxColIdx = startCol;

    parsedRows.forEach((cells: string[], rIdx: number) => {
        const targetRowIdx = startRow + rIdx;
        if (targetRowIdx >= sortedData.length) return; // 卫语句：越界跳过

        maxRowIdx = Math.max(maxRowIdx, targetRowIdx);

        const record = sortedData[targetRowIdx];
        const originalIndex = finalData.indexOf(record);
        if (originalIndex === -1) return; // 卫语句：找不到原数据索引跳过

        const newRecord = { ...newData[originalIndex] };

        cells.forEach((cellStr: string, cIdx: number) => {
            const targetColIdx = startCol + cIdx;
            if (targetColIdx >= columns.length) return; // 卫语句：越界跳过

            maxColIdx = Math.max(maxColIdx, targetColIdx);

            const column = columns[targetColIdx];
            if (column.editable === false || column.key === '_line_number_') return; // 卫语句：不可编辑或行号列跳过

            newRecord[column.dataIndex as string] = cellStr;
            changed = true;
        });
        
        newData[originalIndex] = newRecord;
    });

    if (!changed) {
        return null;
    }

    return {
        newData,
        maxRowIdx,
        maxColIdx
    };
};