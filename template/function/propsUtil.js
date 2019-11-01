const getInitialValue = require('./getInitialValue');

const getProps = (config, type, layerConfig) => {
    if (type === 'Button') {
        return getBtnProps(config, layerConfig);
    }
    if (type === 'Input') {
        return getInputProps(config);
    }
    if (type === 'FormItem') {
        return getFormItemOptions(config);
    }
    return getCompStyle(config);
};

const getCompStyle = (config) => {
    if (hasOwnProperty(config, 'style') && Object.keys(config.style || {}).length > 0) {
        return ` style={${JSON.stringify(config.style)}}`;
    }
    if (hasOwnProperty(config, 'boxStyles') && Object.keys(config.boxStyles || {}).length > 0) {
        return ` style={${JSON.stringify(config.boxStyles)}}`;
    }
    return '';
};

const getBtnProps = (btnConfig, layerConfig) => {
    const { htmlType, antdType, logicType, modalName, skipUrl = '', api = '' } = btnConfig;
    const propsArr = [];
    if (htmlType) {
        propsArr.push(`htmlType="${htmlType}"`);
    }
    if (antdType) {
        propsArr.push(`type="${antdType}"`);
    }
    if (modalName) {
        if (logicType === 'add') {
            propsArr.push(`onClick={() => { 
                this.setState({
                    editData: null,
                    ${modalName}Mode: 'add',
                });
                this.onShowModal('${modalName}');
            }}`);
        } else {
            propsArr.push(`onClick={() => { this.onShowModal('${modalName}'); }}`);
        }
    } else if (logicType === 'mult') {
        const getApiName = require('../function/getApiName');
        propsArr.push('disabled={this.state.selectedRowKeys.length === 0}');
        let concatStr = `
            const { selectedRowKeys } = this.state;
            this.execFetchApi('${getApiName(api)}', selectedRowKeys);
        `;
        if (layerConfig) {
            const { apiArr } = layerConfig;
            const apiObj = apiArr.find(({ requestApi }) => {
                return requestApi === api;
            });
            if (apiObj && apiObj.requestParams) {
                const paramKeyArr = apiObj.requestParams.split(',');
                concatStr = `
                    const { selectedRows } = this.state;
                    const params = selectedRows.reduce((arr, item) => {
                        const _temp = {};
                        ${JSON.stringify(paramKeyArr)}.forEach((pk) => {
                            _temp[pk] = item[pk];
                        });
                        arr.push(_temp);
                        return arr;
                    }, []);
                    this.execFetchApi('${getApiName(api)}', params);
                `;
            }
        }
        propsArr.push(`onClick={() => {
            ${concatStr}
        }}`);
    } else if (logicType === 'skip') {
        propsArr.push(`onClick={() => this.props.history.push('${skipUrl}')}`);
    } else if (logicType === 'reset') {
        propsArr.push(`onClick={this.onResetForm}`);
    }
    if (propsArr.length > 0) {
        return ` ${propsArr.join('\n')}`;
    }
    return '';
};

const getInputProps = (inputConfig) => {
    const { placeholder } = inputConfig;
    if (placeholder) {
        return `placeholder="${placeholder}"`;
    }
    return '';
};

const getFormItemOptions = (config) => {
    const { required, label, type } = config;
    const propsArr = [];
    if (required == 1) {
        const prefixLabel = type === 'Input' || type === 'TextArea' ? '请输入' : '请选择';
        propsArr.push(`rules: [{ required: true, message: "${prefixLabel}${label}" }],`);
    }
    if (hasOwnProperty(config, 'initialValue')) {
        propsArr.push(`initialValue: ${getInitialValue(config)},`);
    }
    if (propsArr.length > 0) {
        propsArr.unshift(`, {`);
        propsArr.push('}');
    }
    return  propsArr.join('\n');
};

const hasOwnProperty = (obj, property) => {
    return Object.hasOwnProperty.call(obj || {}, property);
};

module.exports = {
    getProps,
    hasOwnProperty,
};