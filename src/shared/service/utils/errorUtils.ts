export const checkField = (
    field: string,
    expectNumber: boolean,
    expectPercent: boolean
): string => {
    if (!field) {
        return 'Should not be empty';
    }
    if (expectNumber && isNaN(parseFloat(field))) {
        return 'Should be a number';
    }
    if (expectPercent && (parseFloat(field) < 0 || parseFloat(field) > 1)) {
        return 'Should be beetween 0 and 1';
    }
    return '';
};
