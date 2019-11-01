const renderModalFormData = (fileConfig) => {
    const { layoutConfig } = fileConfig;
    return `componentDidUpdate() {
            const { loading } = this.state;
            const { mode, visible, initApi, editData, dispatch } = this.props;
            // 编辑模式，初始化表单
            if (visible && mode === 'edit' && !this.initEdit && editData && !loading) {
                // 调用接口初始化表单
                if (initApi) {
                    this.onToggleLoading();
                    dispatch({
                        type: \`${fileConfig.pageName}/\${initApi}\`,
                        payload: editData
                    }).then((result) => {
                        this.onToggleLoading();
                        const { code, data } = result;
                        if (code === '0') {
                            this.onInitForm(data);
                        }
                    }).catch(this.onError);
                }
                else {
                    this.onInitForm(editData);
                }
            }
        }
        onInitForm(editData) {
            const { form } = this.props;
            ${onInitForm(layoutConfig)}
        }
    `;
};

const onInitForm = (layoutConfig) => {
    const formConfigs = layoutConfig.find(({ type, formType }) => {
        return type === 'FormContainer' && formType === 'save';
    });
    if (formConfigs) {
        const { formItemArr = [] } = formConfigs;
        const formKeys = [];
        const dateArr = [];
        let dateStr = '';
        formItemArr.forEach((item) => {
            const { name, type } = item;
            if (type === 'DatePicker' || type === 'RangePicker') {
                dateArr.push(item);
            } else {
                formKeys.push(`'${name}'`);
            }
        });
        if (dateArr.length > 0) {
            dateStr = dateArr.reduce((arr, { type, name, format, dateKeys }) => {
                if (type === 'RangePicker' && dateKeys) {
                    const [startKey, endKey] = dateKeys.split(',');
                    arr.push(`if (editData['${startKey}'] && editData['${endKey}']) {
                        formData['${name}'] = [moment(editData['${startKey}'], '${format}'), moment(editData['${endKey}'], '${format}')];
                    }`);
                } else {
                    arr.push(`if (editData['${name}']) {
                        formData['${name}'] = moment(editData['${name}'], '${format}');
                    }`);
                }
                return arr;
            }, []).join('\n');
        }
        return `const formData = [${formKeys.join(',')}].reduce((obj, dataKey) => {
                obj[dataKey] = editData[dataKey];
                return obj;
            }, {});
            ${dateStr}
            form.setFieldsValue(formData);
            this.initEdit = true;
        `;
    }
};

module.exports = renderModalFormData;