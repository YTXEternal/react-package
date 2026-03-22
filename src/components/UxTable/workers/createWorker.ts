import TableWorker from './tableWorker?worker&inline';

export const createTableWorker = () => {
    try {
        // 使用 inline worker，这样打包后 worker 代码会被内联为 blob 字符串
        // 这在使用第三方库时避免了静态资源路径解析错误的问题
        return new TableWorker();
    } catch {
        return null;
    }
};