const renderModal = (configs = {}) => {
    const { layoutConfig = [], title, width } = configs;
    const renderEnter = require('./renderEnter');
    return `<Modal
                maskClosable={false}
                centered
                visible={this.props.visible}
                onCancel={this.onCancel}
                onOk={this.onOk}
                afterClose={this.onResetModal}
                title="${title}"
                width={${parseInt(width || 1024)}}
            >
                <Spin spinning={this.state.loading}>
                    ${renderEnter({ layoutConfig })}
                </Spin>
            </Modal>
    `;
};

module.exports = renderModal;