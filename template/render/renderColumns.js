const renderColumns = (extraConfig) => {
    const { table } =  extraConfig;
    const colsArr = [];
    const { columns = [] } = table;
    if (Array.isArray(columns)) {
        columns.forEach((item, i) => {
            colsArr.push(`${JSON.stringify(item)}`);
        });
    }
    return colsArr.join(',\n');
};

module.exports = renderColumns;