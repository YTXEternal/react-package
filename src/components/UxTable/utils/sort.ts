export const compareValues = (valA: unknown, valB: unknown): number => {
    const isNullA = valA === null || valA === undefined || valA === '';
    const isNullB = valB === null || valB === undefined || valB === '';

    // 两个都是空值，认为相等
    if (isNullA && isNullB) return 0;
    // 空值总是排在最后
    if (isNullA) return 1;
    if (isNullB) return -1;

    // 如果都是数字
    if (typeof valA === 'number' && typeof valB === 'number') {
        return valA - valB;
    }

    // 尝试转成数字比较（适用于数字字符串）
    const numA = Number(valA);
    const numB = Number(valB);
    if (!isNaN(numA) && !isNaN(numB) && typeof valA !== 'boolean' && typeof valB !== 'boolean') {
        return numA - numB;
    }

    // 回退到字符串比较
    return String(valA).localeCompare(String(valB));
};
