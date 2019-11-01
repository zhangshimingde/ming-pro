const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');
const beautify = require('./beautifyCode');
const getImportString = require('./getImportString');
const renderColumns = require('../render/renderColumns');
const renderProp = require('../render/renderProp');
const renderExport = require('../render/renderExport');
const renderConstructor = require('../render/renderConstructor');
const renderMethod = require('../render/renderMethod');
const renderModel = require('../render/renderModel');
const renderEnter = require('../render/renderEnter');
const renderModalFormData = require('../render/renderModalFormData');
const renderService = require('../render/renderService');

const getEjsFile = (fileType) => {
    let ejsFile = '';
    switch (fileType) {
        case 'modal':
            ejsFile = '../basicModal.ejs';
            break;
        case 'model':
            ejsFile = '../basicModel.ejs';
            break;
        case 'service':
            ejsFile = '../basicService.ejs';
            break;
        case 'columns':
            ejsFile = '../columns.ejs';
            break;
        default:
            ejsFile = '../basicPage.ejs';
            break;
    }
    return path.resolve(__dirname, ejsFile);
};

const renderCallBack = (err, data, sourceCodeDir, fileName, resolve, reject) => {
    if(err) {
        const msgObj = {
            code: '-1',
            info: '页面生成失败:' + JSON.stringify(err),
        };
        resolve(msgObj);
        console.log('createFile', err);
    } else {
        fs.writeFileSync(path.resolve(sourceCodeDir, fileName), data);
        beautify(sourceCodeDir, fileName).then((result) => {
            resolve(result);
        }).catch((e) => {
            console.log('beautify exception:', e);
            reject(e);
        });
    }
};

const createFile = async (pageName, fileConfig, sourceCodeDir) => {
    const { layoutConfig, layerConfig, fileType = 'page' } = fileConfig;
    const fileName = fileType === 'page' ? 'index.js' : `${pageName}.js`;
    const sourceFile = path.resolve(sourceCodeDir, fileName);
    const templateFile =  getEjsFile(fileType);
    fs.ensureFileSync(sourceFile);
    const initImports = fileType === 'modal' ? ['Modal', 'Spin', 'message'] : ['Spin'];
    const [ importString, extraConfig ] = getImportString(layoutConfig, layerConfig, initImports);
    if (layerConfig && layerConfig.modalArr.length > 0) {
        extraConfig.modalArr = layerConfig.modalArr;
    }
    const renderPageData = {
        pageName,
        fileConfig,
        extraConfig: Object.assign({}, extraConfig, { pageName }),
        importString,
        renderProp,
        renderConstructor,
        renderMethod,
        renderModel,
        renderExport,
        renderEnter,
        renderModalFormData,
        renderService,
    };
    if (extraConfig.table) {
        const results = await Promise.all([new Promise((resolve, reject) => {
            ejs.renderFile(getEjsFile('columns'), {
                extraConfig,
                renderColumns,
                }, (err, data) => {
                    renderCallBack(err, data, sourceCodeDir, 'columns.js', resolve, reject);
                }
            );
        }), new Promise((resolve, reject) => {
            const importsArr = importString.split('\n');
            importsArr.splice(1, 0, 'import columns from \'./columns\';');
            ejs.renderFile(templateFile, Object.assign({}, renderPageData, { importString: importsArr.join('\n')}), (err, data) => {
                    renderCallBack(err, data, sourceCodeDir, fileName, resolve, reject);
                }
            );
        })]);
        let responseObj = {};
        for (let r of results) {
            responseObj= r;
            if (r.code != '0') {
                break;
            }
        }
        return responseObj;
    }
    return await new Promise((resolve, reject) => {
        ejs.renderFile(templateFile, renderPageData, (err, data) => {
                renderCallBack(err, data, sourceCodeDir, fileName, resolve, reject);
            }
        );
    });
};

module.exports = createFile;