const renderForm = require('./renderForm');
const renderBox = require('./renderBox');
const renderModal = require('./renderModal');
const renderHeader = require('./renderHeader');
const renderTable = require('./renderTable');

const renderContainer = (renderConfig, pageName, layerConfig) => {
    const { type } = renderConfig;
    let component = null;
    if (!Object.hasOwnProperty.call(renderConfig, 'type')) {
        return component;
    }
    switch(type) {
        case 'FormContainer':
            component = renderForm(renderConfig, layerConfig);
            break;
        case 'LineContainer':
            component = renderLine();
            break;
        case 'TableContainer':
            component = renderTable(renderConfig, layerConfig);
            break;
        case 'BoxContainer':
            component = renderBox(renderConfig, layerConfig);
            break;
        case 'ModalContainer':
            component = renderModal(renderConfig, layerConfig);
            break;
        case 'HeaderContainer':
            component = renderHeader(renderConfig, layerConfig);
            break;
        default:
            break;
    }
    return component;
};

const renderLine = () => {
    return '<Divider />';
};

module.exports = renderContainer;