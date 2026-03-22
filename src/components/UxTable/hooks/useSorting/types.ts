export interface SortState {
    colIndex: number;
    order: 'asc' | 'desc';
}

export interface UseSortingReturn<DataSource extends unknown[]> {
    sortState: SortState | null;
    handleSort: (index: number) => void;
    sortedData: DataSource;
}
