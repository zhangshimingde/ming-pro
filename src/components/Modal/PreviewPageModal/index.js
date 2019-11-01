/**
 * @desc 页面预览窗口
 */
import React, { Component } from 'react';
import MainContainer from '../../Container/MainContainer';
import { Modal, Layout } from 'antd';
import './index.css';
const { Sider, Content } = Layout;

class PreviewPageModal extends Component {
    render() {
        const { showModal, layoutConfig, onCloseModal, layerConfig } = this.props;
        return (
            <Modal
                visible={showModal}
                footer={null}
                width={'100%'}
                closable
                centered
                wrapClassName="preview-page-modal"
                onCancel={onCloseModal}
                title="页面预览"
                maskClosable
            >
                <div className="preview-container">
                    <Layout>
                        <Sider width="210">
                        </Sider>
                        <Layout>
                            <Content>
                                <MainContainer
                                    visible={showModal}
                                    layoutConfig={layoutConfig}
                                    layerConfig={layerConfig}
                                    preview
                                    noLayer
                                />
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            </Modal>
        );
    }
}

export default PreviewPageModal;