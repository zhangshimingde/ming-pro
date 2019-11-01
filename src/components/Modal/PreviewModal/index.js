/**
 * @desc 点击事件弹窗视图
 */
import React, { PureComponent, Fragment } from 'react';
import { Modal, message, Spin } from 'antd';
import moment from 'moment';
import renderComponent from '../../../utils/RenderUtil';
import { getFormApi, getFormByType, getSubmitData } from '../../../utils/FormUtil';
import { MODE_EDIT, FORM_SAVE, CODE_SUCCESS } from '../../../utils/Constants';
import './index.css';

class PreviewModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onAfterClose = this.onAfterClose.bind(this);
        this.onFormRenderCallBack = this.onFormRenderCallBack.bind(this);
        this.initEdit = false;
    }
    componentDidUpdate() {
        const { mode, visible, recordData, api, execFetchApi, modalLayoutConfig } = this.props;
        // 编辑模式
        if (visible && mode === MODE_EDIT && !this.initEdit) {
            if (api) { // 需要调用接口查询数据
                this.setState({
                    loading: true,
                });
                execFetchApi(api, recordData).then((res) => {
                    const { code, data } = res;
                    if (code === '0') {
                        this.onInitForm(data);
                    }
                    this.setState({
                        loading: false,
                    });
                }).catch(() => {
                    this.setState({
                        loading: false,
                    });
                });
            } else if (recordData) { // 传递的编辑数据
                this.onInitForm(modalLayoutConfig, recordData);
            }
            this.initEdit = true;
        }
    }
    onInitForm(layoutConfig, editData) {
        const formObj = getFormByType(layoutConfig, FORM_SAVE);
        if (formObj && Array.isArray(formObj.formItemArr)) {
            const formData = formObj.formItemArr.reduce((obj, item) => {
                const { type, name, format = 'YYYY-MM-DD', dateKeys } = item;
                if (type === 'DatePicker') {
                    obj[name] = moment(editData[name], format);
                } else if (type === 'RangePicker' && dateKeys) {
                    const [ startTime, endTime ] = dateKeys;
                    if (editData[startTime] && editData[endTime]) {
                        obj[name] = [moment(editData[startTime], format), moment(editData[endTime], format)];
                    }
                } else {
                    obj[name] = editData[name];
                }
                return obj;
            }, {});
            if (this.form) {
                this.form.setFieldsValue(formData);
            }
            this.formData = formData;
        } else {
            message.warn('请配置编辑弹窗');
        }
    }
    onCancel() {
        const { loading } = this.state;
        if (loading) {
            return;
        }
        const { modalName, onCancelModal } = this.props;
        onCancelModal(modalName);
    }
    renderContent(layoutConfig = []) {
        const { mode } = this.props;
        return layoutConfig.map((item, i) => {
            return (
                <Fragment key={`preview-${i}`}>
                    {renderComponent(item, {
                        preview: true,
                        context: this,
                        mode,
                        onFormRenderCallBack: this.onFormRenderCallBack })}
                </Fragment>
            );
        });
    }
    onSubmit() {
        const { loading } = this.state;
        if (loading) {
            return;
        }
        const { onOkModal, modalName, mode, modalLayoutConfig, layerConfig, recordData } = this.props;
        if(this.form) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (Array.isArray(modalLayoutConfig)) {
                        const formObj = getFormByType(modalLayoutConfig, FORM_SAVE);
                        if (formObj) {
                            const api = getFormApi(mode, formObj); // 根据模式获取对应接口地址
                            const { apiArr } = layerConfig;
                            const apiObj = apiArr.find(({ requestApi }) => {
                                return requestApi === api;
                            });
                            if (apiObj && apiObj.requestParams) { // 接口入参
                                const paramsArr = apiObj.requestParams.split(',');
                                paramsArr.forEach((paramKey) => {
                                    if (Object.hasOwnProperty.call(recordData, paramKey) && !Object.hasOwnProperty.call(values, paramKey)) {
                                        values[paramKey] = recordData[paramKey];
                                    }
                                });
                            }
                            if (api) {
                                this.setState({
                                    loading: true,
                                });
                                onOkModal(modalName, api, getSubmitData(formObj, values)).then((res) => {
                                    const { data } = res;
                                    const { code } = data || {};
                                    this.setState({
                                        loading: false,
                                    });
                                    if (code === CODE_SUCCESS) {
                                        message.success('保存成功');
                                        this.onCancel();
                                    }
                                }).catch(() => {
                                    this.setState({
                                        loading: false,
                                    });
                                });
                            } else {
                                message.warn('请配置form的api属性');
                            }
                        } else {
                            message.warn('请配置form组件');
                        }
                    } else {
                        message.warn('请配置form组件');
                    }
                }
            });
        } else {
            message.warn('请配置form组件');
        }
    }
    onFormRenderCallBack(form) {
        this.form = form;
        if (this.formData) {
            this.form.setFieldsValue(this.formData);
        }
    }
    onAfterClose() {
        this.initEdit = false;
        this.formData = null;
        if (this.form) {
            this.form.resetFields();
        }

    }
    render() {
        const { title, visible, modalLayoutConfig, mode } = this.props;
        const { loading } = this.state;
        return (
            <Modal
                title={mode === MODE_EDIT ? '编辑' : title}
                visible={visible}
                onCancel={this.onCancel}
                onOk={this.onSubmit}
                afterClose={this.onAfterClose}
                maskClosable={false}
            >
                <Spin spinning={loading}>
                    {this.renderContent(modalLayoutConfig)}
                </Spin>
            </Modal>
        );
    }
}

export default PreviewModal;