const getDispatchStr =(form, fileConfig, pageName) => {
    const getApiName = require('../function/getApiName');
    const { formType, queryApi = '', addApi, editApi } = form;
    if (formType === 'query') {
        const formConfigs = getFormConfigsByType(fileConfig);
        return queryApi ? `${getSubmitValues(formConfigs, fileConfig)}
        this.onToggleLoading();
        dispatch({
            type: '${pageName}/${getApiName(queryApi)}',
            payload: values,
        }).then(() => {
            this.onToggleLoading();
        }).catch(this.onError);` : '// add code here';
    } else {
        const formConfigs = getFormConfigsByType(fileConfig, 'save');
        return `
            const { mode = 'add' } = this.props;
            const disptachType = mode === 'add' ? '${pageName}/${getApiName(addApi)}' : '${pageName}/${getApiName(editApi)}';
            ${getSubmitValues(formConfigs, fileConfig)}
            this.onToggleLoading();
            dispatch({
            type: disptachType,
            payload: values,
        }).then((res) => {
            this.onToggleLoading();
            const { code } = res;
            if (code === '0') {
                message.success('保存成功');
                ${fileConfig.fileType === 'modal' ? 'this.onCancel(true);' : ''}
            }
        }).catch(this.onError);
        `;
    }
};

const getSubmitValues = (formConfigs, fileConfig = {}) => {
    const { formItemArr = [], editApi } = formConfigs || {};
    const dateArr = [];
    let dateStr = '';
    formItemArr.forEach((item) => {
        const { type } = item;
        if (type === 'DatePicker' || type === 'RangePicker') {
            dateArr.push(item);
        }
    });
    if (dateArr.length > 0) {
        dateStr = dateArr.reduce((arr, { type, name, format = 'YYYY-MM-DD', dateKeys }) => {
            if (type === 'RangePicker' && dateKeys) {
                const [startKey, endKey] = dateKeys.split(',');
                arr.push(`if (Array.isArray(values['${name}']) && values['${name}'].length > 0) {
                    const [ startTime, endTime ] = values['${name}'];
                    values['${startKey}'] = startTime.format('${format}');
                    values['${endKey}'] = endTime.format('${format}');
                    delete values['${name}'];
                }`);
            } else {
                arr.push(`values['${name}'] = values['${name}'] && values['${name}'].format('${format}');`);
            }
            return arr;
        }, []).join('\n');
    }
    let editParams = '';
    if (editApi) {
        const { deleteWhiteSpace } = require('../function/common');
        const _editApi = deleteWhiteSpace(editApi);
        const { layerConfig = {} } = fileConfig;
        const { apiArr = [] } = layerConfig;
        const apiObj = apiArr.find(({ requestApi }) => {
            return _editApi === deleteWhiteSpace(requestApi);
        });
        if (apiObj) {
            const { requestParams } = apiObj;
            editParams = requestParams.split(',').reduce((arr, pid) => {
                arr.push(`values.${pid} = editData.${pid};`);
                return arr;
            }, ["if (mode === 'edit') {\n"]).join('\n') + '\n}';
        }
    }
    return dateStr + '\n' + editParams;
};

const getFormConfigsByType = (fileConfig, pType = 'query') => {
    return getFormArr(fileConfig).find(({ formType }) => {
        return pType === formType;
    });
};

const getFormArr = (fileConfig) => {
    const { layoutConfig = [] } = fileConfig;
    const formArr = layoutConfig.reduce((arr, item) => {
        const { type, cellsArr } = item;
        if (Array.isArray(cellsArr) && cellsArr.length > 0) {
            arr.push(...getFormArr({ layoutConfig: cellsArr }));
        } else if (type === 'FormContainer') {
            arr.push(item);
        }
        return arr;
    }, []);
    return formArr;
};

const renderOpItem = (itemConfigs) => {
    const getApiName = require('../function/getApiName');
    const { opText, opType, modalData, modalName, api } = itemConfigs;
    let str = '';
    if (opType === 'edit' || opType === 'view') {
        str =  modalData === 'table' ? `this.setState({ editData: record, ${modalName}Mode: '${opType}' });` :
            `this.setState({ editData: record, init${modalName}Api: '${getApiName(api)}', ${modalName}Mode: '${opType}' });`;
        return `<a onClick={() => {
            ${str}
            this.onShowModal('${modalName}');
        }}>${opText}</a>`;
    }
    return `<a href="javascript:void(0);">${opText}</a>`;
};

const renderOperation = (operationArr) => {
    return `_columns[columns.length - 1].render = (text, record) => {
        return (
            <Fragment>
            ${
                operationArr.map((itemConfigs) => {
                    return renderOpItem(itemConfigs);
                }).join('\n<Divider type="vertical" />\n')
            }
        </Fragment>
        );
    };`;
};

const renderMethod = (extraConfig, fileConfig, pName) => {
    const {
        form,
        table,
        pageName,
        modalArr,
    } =  extraConfig;
    const methodStrArr= [
        `onError(e) {
            this.onToggleLoading();
        }
        onToggleLoading() {
            this.setState({
                loading: !this.state.loading,
            });
        }
        execFetchApi(api, params) {
            const { dispatch } = this.props;
            this.onToggleLoading();
            dispatch({
                type: \`${pName || pageName}/\${api}\`,
                payload: params,
            }).then(() => {
                this.onToggleLoading();
            }).catch(this.onError);
        }
        `
    ];
    if (form) {
        methodStrArr.push(`
            onSubmit(e) {
                e && e.preventDefault();
                ${ fileConfig.fileType === 'modal' ? 'const { form, dispatch, editData } = this.props;' : 'const { form, dispatch } = this.props;' }
                form.validateFields((err, values) => {
                    if (!err) {
                       ${getDispatchStr(form, fileConfig, pName || pageName)}
                    }
                });
            }
            onResetForm = () => {
                this.props.form.resetFields();
            }
        `);
    }
    if (modalArr) {
        methodStrArr.push(`
            onHiddenModal = (modalName, updateList) => {
                this.setState({
                    [\`show\${modalName\}\`]: false,
                });
                if (updateList && typeof this.onSubmit === 'function') {
                    this.onSubmit();
                }
            }
        `);
        methodStrArr.push(`
            onShowModal = (modalName) => {
                this.setState({
                    [\`show\${modalName\}\`]: true,
                });
            }
        `);
    }
    if (table) {
        const { hasOperation, operationArr = [] } = table;
        methodStrArr.push(`
        onInitColumns = (columns) => {
            const _columns = columns;
            ${
                hasOperation === '1' && operationArr.length > 0 ? renderOperation(operationArr) : ''
            }
            return _columns;
        }
        `);
    }
    if (table && table.pagination) {
        let pIndexKey = 'PageIndex';
        let pSizeKey = 'PageSize';
        if (table.apiObj) {
            const { paginationParams } = table.apiObj;
            const [ pIndex, pSize ] = paginationParams.split('/');
            pIndexKey = pIndex;
            pSizeKey = pSize;
        }
        methodStrArr.push(`
        onPageIndexChange = (page, pageSize) => {
            this.setState({
                ${pIndexKey}: page,
                ${pSizeKey}: pageSize,
            })
        }
        onShowSizeChange = (current, size) => {
            this.setState({
                ${pIndexKey}: current,
                ${pSizeKey}: size,
            });
        }
        `);
    }
    return methodStrArr.join('\n');
};

module.exports = renderMethod;