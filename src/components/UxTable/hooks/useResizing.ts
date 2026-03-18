import { useState, useRef } from 'react';
import type { UxTableColumn } from '../types';

export const useResizing = <DataSource extends unknown[]>(
    propColumns: UxTableColumn<DataSource[number]>[]
) => {
    const [columns, setColumns] = useState(() => propColumns.map(col => ({
        ...col,
        width: typeof col.width === 'number' ? col.width : (col.width ? parseInt(col.width as string, 10) : undefined)
    })));

    const [prevPropColumns, setPrevPropColumns] = useState(propColumns);

    if (propColumns !== prevPropColumns) {
        setPrevPropColumns(propColumns);
        setColumns(propColumns.map(col => ({
            ...col,
            width: typeof col.width === 'number' ? col.width : (col.width ? parseInt(col.width as string, 10) : undefined)
        })));
    }

    const resizingColIndexRef = useRef<number | null>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    const handleResizeMouseDown = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        resizingColIndexRef.current = index;
        startXRef.current = e.clientX;
        startWidthRef.current = columns[index].width || (e.target as HTMLElement).parentElement?.offsetWidth || 100;

        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
    };

    const handleResizeMouseMove = (e: MouseEvent) => {
        if (resizingColIndexRef.current === null) return;
        const deltaX = e.clientX - startXRef.current;
        const newWidth = Math.max(50, startWidthRef.current + deltaX);
        setColumns(prev => {
            const next = [...prev];
            next[resizingColIndexRef.current as number] = {
                ...next[resizingColIndexRef.current as number],
                width: newWidth
            };
            return next;
        });
    };

    const handleResizeMouseUp = () => {
        resizingColIndexRef.current = null;
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
    };

    return {
        columns,
        handleResizeMouseDown
    };
};
