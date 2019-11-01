let extraConfig = {};

const getImportString = (layoutConfig = [], layerConfig = [], initImports = []) => {
    extraConfig = {};
    const results = new Array(2);
    const antdImportSets = conbine(getAntdImportString(layoutConfig), new Set(initImports));
    results[1] = Object.assign({}, extraConfig);
    const otherImportSets = getOtherImportString(antdImportSets);
    const { modalArr = [] } = layerConfig;
    const modalImports = initImports.indexOf('Modal') >= 0 ? '' : modalArr.reduce((arr, { name }) => {
        arr.push(`import ${name} from './${name}';`);
        return arr;
    }, []).join('\n');
    results[0] = (antdImportSets.size > 0 ? "import { " + Array.from(antdImportSets).join(', ') + " } " 
        + `from 'antd';\n${modalImports}\n${otherImportSets.join('\n')}` : '');
    return results;
};

function conbine(setA, setB) {
    for (let elem of setB) {
        setA.add(elem);
    }
    return setA;
}

const getAntdImportString = (layoutConfig = []) => {
    const antdImportSets = new Set();
    layoutConfig.forEach((item) => {
        if (item.type === 'FormContainer') {
            antdImportSets.add('Form');
            antdImportSets.add('Row');
            antdImportSets.add('Col');
            extraConfig.form = item;
            const { formItemArr = [] } = item;
            formItemArr.forEach((formItem) => {
                formItem.type && antdImportSets.add(formItem.type);
            });
        } else if (item.type === 'TableContainer') {
            extraConfig.table = item;
            if (item && item.hasOperation && item.operationArr.length > 1) {
                antdImportSets.add('Divider');
            }
            antdImportSets.add('Table');
        } else if (item.type === 'LineContainer') {
            antdImportSets.add('Divider');
        } else {
            if (Object.keys(item || {}).length > 0 && Array.isArray(item.cellsArr)) {
                conbine(antdImportSets, getAntdImportString(item.cellsArr));
            } else if (item.type) {
                antdImportSets.add(item.type);
            }
        }
    });
    return antdImportSets;
};

const getOtherImportString = (antdImportSets) => {
    const antherImports = [];
    if (antdImportSets.has('RangePicker') || antdImportSets.has('DatePicker')) {
        antherImports.push("import moment from 'moment';");
        antdImportSets.delete('RangePicker');
    }
    if (antdImportSets.has('Table')) {
        antherImports.push("import { Table } from 'fl-pro';");
        antdImportSets.delete('Table');
    }
    if (antdImportSets.has('RangePicker')) {
        antherImports.push('const { RangePicker } = DatePicker;');
    } 
    if (antdImportSets.has('TextArea')) {
        antherImports.push('const { TextArea } = Input;');
        antdImportSets.delete('TextArea');
    }
    if (antdImportSets.has('Select')) {
        antherImports.push('const { Option } = Select;');
    }
    if (antdImportSets.has('Form')) {
        antherImports.push('const FormItem = Form.Item;');
    }
    return antherImports;
};

module.exports = getImportString;