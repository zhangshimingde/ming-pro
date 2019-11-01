const { getProps } = require('../function/propsUtil');

const renderBoxCell = (config, layoutColumn, layerConfig) => {
    const renderWidget = require('./renderWidget');
    return `<div className="cell cell-${layoutColumn}">
                ${renderWidget(config, '', layerConfig)}
            </div>
    `;
};

const renderBox = (configs, layerConfig) => {
    const { layoutColumn = 1 } = configs;
    return `<div className="fulu-box"${getProps(configs)}>
                ${Array.isArray(configs.cellsArr) ? configs.cellsArr.map((config) => renderBoxCell(config, layoutColumn, layerConfig)).join('') : ''} 
            </div>`;
};

module.exports = renderBox;