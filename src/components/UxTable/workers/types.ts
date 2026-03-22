export type WorkerColumn = {
    key?: string | number | symbol | bigint;
    dataIndex: string | number | symbol;
    editable?: boolean;
};

export type Bounds = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

export type CopyPayloadData = {
    selectedData: Record<string, unknown>[];
    columns: WorkerColumn[];
};

export type PasteParsePayloadData = {
    text: string;
};

export type PastePayloadData = {
    text: string;
    finalData: Record<string, unknown>[];
    sortedData: Record<string, unknown>[];
    columns: WorkerColumn[];
    startRow: number;
    startCol: number;
    cutBounds?: Bounds | null;
};

export type DeletePayloadData = {
    finalData: Record<string, unknown>[];
    sortedData: Record<string, unknown>[];
    columns: WorkerColumn[];
    bounds: Bounds;
};

export type WorkerPayload =
    | { type: 'COPY'; data: CopyPayloadData }
    | { type: 'PASTE_PARSE'; data: PasteParsePayloadData }
    | { type: 'PASTE'; data: PastePayloadData }
    | { type: 'DELETE'; data: DeletePayloadData };

export type WorkerResult =
    | string
    | string[][]
    | { newData: Record<string, unknown>[]; maxRowIdx?: number; maxColIdx?: number }
    | null;
