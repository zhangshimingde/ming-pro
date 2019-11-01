const renderWidget = require('./renderWidget');
const renderModal = require('./renderModal');
const renderModalInPage = require('./renderModalInPage');
/**
 * @desc 渲染主入口
 * @param {object} fileConfig 渲染配置参数对象
 * @param {boolean} isMainPage 是否是主页面
 */
const renderEnter = (fileConfig, pageName, isMainPage = false) => {
    const { layoutConfig = [], layerConfig = {}, fileType } = fileConfig;
    if (fileType === 'modal') { // 渲染单独的弹窗文件
        return renderModal(fileConfig);
    }
    const renderStrArr = [];
    layoutConfig.forEach((config) => {
        renderStrArr.push(renderWidget(config, pageName, layerConfig));
    });

    if (isMainPage) { // 是主页面，渲染modal到主视图
        const { modalArr = [] } = layerConfig;
        modalArr.forEach((modalConfig) => {
            renderStrArr.push(renderModalInPage(modalConfig));
        });
    }
    return renderStrArr.join('');
};

module.exports = renderEnter;