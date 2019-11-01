const renderModalInPage = ({ name }) => {
    return `
        <${name}
            dispatch={this.props.dispatch}
            editData={this.state.editData}
            mode={this.state.${name}Mode}
            initApi={this.state.init${name}Api}
            visible={this.state.show${name}}
            onCancel={this.onHiddenModal}
        />
    `;
};

module.exports = renderModalInPage;