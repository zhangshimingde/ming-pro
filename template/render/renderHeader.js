// const renderWidget = require('./renderWidget');

const renderHeaderCell = (config, cellNum = 1, layerConfig) => {
    const renderWidget = require('./renderWidget');
    return `<div className="cell cell-${cellNum}">
        ${renderWidget(config, layerConfig)}
    </div>`;
};

const renderHeader = (configs, layerConfig) => {
    return `<div className="fulu-header">
        ${Array.isArray(configs.cellsArr) ? configs.cellsArr.map((config) => {
            return renderHeaderCell(config, configs.cellsArr.length, layerConfig)
            }) : ''}
        </div>
    `;
};

module.exports = renderHeader;