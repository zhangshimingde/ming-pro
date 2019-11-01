const renderExport = (extraConfig) => {
    const { form, pageName } =  extraConfig;
    if (form) {
        return `export default Form.create()(${pageName});`;
    }
    return `export default ${pageName};`;
};

module.exports = renderExport;