const renderProp = (extraConfig) => {
    const {
        form,
        table,
        pageName,
    } =  extraConfig;
    const strArr = [];
    if (form) {
        strArr.push(`
            const { form } = this.props;
            const { getFieldDecorator } = form;
        `);
    }
    if (table) {
        const { modelKey = '', pagination } = table;
        if (pagination) {
            let pIndexKey = 'PageIndex';
            let pSizeKey = 'PageSize';
            if (table.apiObj) {
                const { paginationParams } = table.apiObj;
                const [ pIndex, pSize ] = paginationParams.split('/');
                pIndexKey = pIndex;
                pSizeKey = pSize;
            }
            strArr.push(`
                const { ${pIndexKey}, ${pSizeKey} } = this.state;
                const { ${modelKey}Total, ${modelKey} } = this.props.${pageName};
            `);
        } else {
            strArr.push(`
            const { ${modelKey} } = this.props.${pageName};
        `);
        }
    }
    return strArr.join('\n');
};

module.exports = renderProp;