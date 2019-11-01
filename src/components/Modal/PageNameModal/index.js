import React, { Component } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import './index.css';

class PageNameModal extends Component {
    constructor(props) {
        super(props);
        this.afterClose = this.afterClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e && e.preventDefault();
        const { form, onOkModal } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { pageName, projectDir } = values;
                onOkModal(pageName, projectDir);
            }
        });
    }
    afterClose() {
        this.props.form.resetFields();
    }
    render() {
        const { visible, form, onCloseModal } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                footer={null}
                width={450}
                closable
                maskClosable={false}
                centered
                afterClose={this.afterClose}
                onOk={this.onSubmit}
                onCancel={onCloseModal}
                title="页面名称"
            >
                <Form
                    onSubmit={this.onSubmit}
                    style={{ padding: '20px 40px' }}
                >
                    <Form.Item>
                        {getFieldDecorator('pageName', {
                            rules: [
                                { required: true, message: '请输入页面名称!' },
                                { pattern: /^[a-zA-Z]+$/, message: '名称只能包含字母！' }
                            ],
                        })(
                            <Input placeholder="只能包含字母" />
                        )}
                    </Form.Item>
                    {
                        window.ipcRenderer ? (<Form.Item>
                            {getFieldDecorator('projectDir', {
                                rules: [
                                    { required: true, message: '请输入项目文件夹!' },
                                ],
                            })(
                                <Input placeholder="项目文件夹" />
                            )}
                        </Form.Item>) : null
                    }
                    <Form.Item  style={{ marginTop: '15px', textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PageNameModal);