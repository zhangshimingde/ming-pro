const deleteBlankLine = (str) => {
    return str && str.replace(/^\n\s\S\n$/, '');
};

const deleteWhiteSpace = (str) => {
    return str && str.replace(/^\s*|\s*$/g, '');
};

module.exports = {
    deleteBlankLine,
    deleteWhiteSpace,
};

