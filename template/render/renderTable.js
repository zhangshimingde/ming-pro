const getTableProps = (configs, layerConfig) => {
    const { modelKey = '[]', pagination, rowKey = '', rowSelection } = configs;
    let pIndexKey = 'PageIndex';
    let pSizeKey = 'PageSize';
    if (modelKey) {
        const { apiArr } = layerConfig;
        const apiObj = apiArr.find((item) => {
            return item.modelKey === modelKey;
        });
        if (apiObj) {
            const { paginationParams } = apiObj;
            const [ pIndex, pSize ] = paginationParams.split('/');
            pIndexKey = pIndex;
            pSizeKey = pSize;
        }
    }
    const propsArr = [`dataSource={${modelKey}}`];
    if (pagination) {
        propsArr.push(`pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            total: ${modelKey}Total,
            current: ${pIndexKey},
            pageSize: ${pSizeKey},
            onChange: this.onPageIndexChange,
            onShowSizeChange: this.onShowSizeChange,
        }}`);
    }
    if (rowKey) {
        propsArr.push(`rowKey="${rowKey}"`);
    }
    if (rowSelection) {
        propsArr.push(`rowSelection={{
            type: "${rowSelection.type}",
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                });
            }
        }}`);
    }
    return propsArr.join('\n');
};

const renderTable= (configs = {}, layerConfig) => {
    return `<Table
                columns={this.columns}
                ${getTableProps(configs, layerConfig)}
            />
    `;
};

module.exports = renderTable;