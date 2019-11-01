const { deleteWhiteSpace } = require('./common');

const getApiName = (requestApi) => {
    return requestApi && deleteWhiteSpace(requestApi.slice(requestApi.lastIndexOf('/') + 1));
};

module.exports = getApiName;