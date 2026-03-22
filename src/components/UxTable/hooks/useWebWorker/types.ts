export type WorkerFallback<T, R> = (payload: T) => Promise<R> | R;

export interface UseWebWorkerReturn<T, R> {
    postMessage: (payload: T) => Promise<R>;
}
