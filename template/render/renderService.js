const getApiName = require('../function/getApiName');
const { deleteWhiteSpace } = require('../function/common');

const concatReqUrl = (requestHost, requestApi) => {
    if (requestHost === 'authCode') {
        return `host.passport.authCode + "${requestApi}"`;
    }
    return `host.${requestHost} + "${requestApi}"`;
};

const renderService = ({ layerConfig }) => {
    const { apiArr = [] } = layerConfig;
    return apiArr.map(({ requestHost, requestMethod, requestApi }) => {
        const _requestApi = deleteWhiteSpace(requestApi);
        if (requestMethod === 'GET') {
            return `export const ${getApiName(_requestApi)} = (params) => {
                return axios.get(${concatReqUrl(requestHost, _requestApi)}, { params });
            };`;
        } else {
            return `export const ${getApiName(_requestApi)} = (params) => {
                return axios.post(${concatReqUrl(requestHost, _requestApi)}, params);
            };`;
        }
    }).join('\n');
};

module.exports = renderService;