function getInitialValue(config) {
    const { type = 'Input', initialValue, dateFormat = 'YYYY-MM-DD' } = config;
    if (type === 'DatePicker' || type === 'RangePicker') {
        if (initialValue) {
            return `moment('${initialValue}', '${initialValue}')`;
        }
        return "''";
    }
    return `'${config.initialValue || ''}'`;
}
module.exports = getInitialValue;