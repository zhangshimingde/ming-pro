const getApiName = require('../function/getApiName');

const getPaylodStr = (modelKey, requestPagination) => {
    if (requestPagination === '1') {
        return `
            ${modelKey}: result.data &&  Array.isArray(result.data.list) ? result.data.list: [],
            ${modelKey}Total: result.data && result.data.total,
        `;
    }
    return `
        ${modelKey}: result.data,
    `;
};

const renderEffect = (requestApi, modelKey, requestPagination) => {
    const apiName = getApiName(requestApi);
    return `
        *${apiName}(action, { call, put }) {
            const result = yield call(service.${apiName}, action.payload || {});
            if(result.code != CODE_SUCCESS) {
                result && message.error(result.message);
            } else {
                yield put({
                    type: 'updateState',
                    payload: {
                        ${getPaylodStr(modelKey, requestPagination)}
                    },
                });
            }
            return result;
        },
    `;
};

const renderModel = ({ layerConfig }) => {
    const { apiArr = [] } = layerConfig;
    const { state, effects } = apiArr.reduce((obj, { modelKey, requestApi, requestPagination }) => {
        if (requestPagination === '1') {
            obj.state.push(`${modelKey}: [],`);
            obj.state.push(`${modelKey}Total: 0,`);      
        } else {
            obj.state.push(`${modelKey}: {},`);
        }
        obj.effects.push(renderEffect(requestApi, modelKey, requestPagination));
        return obj;
    }, { state: [], effects: [] });
    return `
        state: {
            ${state.join('\n')}
        },
        effects: {
            ${effects.join('\n')}
        },
    `;
};

module.exports = renderModel;