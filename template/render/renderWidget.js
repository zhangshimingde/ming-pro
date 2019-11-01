const { getProps } = require('../function/propsUtil');
const renderButton = require('./renderButton');
const renderContainer = require('./renderContainer');

const renderWidget = (renderConfig, pageName, layerConfig) => {
    const { type } = renderConfig;
    let component = '';
    if (!Object.hasOwnProperty.call(renderConfig, 'type')) {
        return component;
    }
    switch(type) {
        case 'Text':
            component = renderText(renderConfig);
            break;
        case 'Breadcrumb':
            component = renderBreadcrumb(renderConfig);
            break;
        case 'Select':
            component = renderSelect(renderConfig);
            break;
        case 'RangePicker':
            component = renderRangePicker(renderConfig);
            break;
        case 'DatePicker':
            component = renderDatePicker(renderConfig);
            break;
        case 'Radio':
            component = renderRadio(renderConfig);
            break;
        case 'Checkbox':
            component = renderCheckbox(renderConfig);
            break;
        case 'Tabs':
            component = renderTabs(renderConfig);
            break;
        case 'Input':
            component = renderInput(renderConfig);
            break;
        case 'TextArea':
            component = renderTextArea(renderConfig);
            break;
        case 'Button':
            component = renderButton(renderConfig, layerConfig);
            break;
        case 'FormContainer':
        case 'ModalContainer':
        case 'LineContainer':
        case 'TableContainer':
        case 'BoxContainer':
        case 'HeaderContainer':
            component = renderContainer(renderConfig, pageName, layerConfig);
            break;
        default:
            break;
    }
    return component;
};

const renderInput = (configs) => {
    return `<Input ${getProps(configs, 'Input')}/>`;
};

const renderTextArea = (configs) => {
    const { colIndex, dropIndex, originSpan, cellStyles, hasLinkage,  ...rest } = configs;
    return `<TextArea ${getProps(configs, 'TextArea')} />`;
};

const renderText = (configs) => {
    const { text, style } = configs;
    return `<span style={${JSON.stringify(style)}}>${text}</span>`;
};
const renderBreadcrumb = (configs) => {
    const { breadcrumbArr = []} = configs;
    return `<Breadcrumb${getProps(configs)}>
        ${breadcrumbArr.map(({ label, value }, i) => {
        return `
            <Breadcrumb.Item key="breadcrumb-${i}">
                ${ value ? `<a href="${value}">${label}</a>` : `<span>${label}</span>`}
            </Breadcrumb.Item>
        `
        }).join('')}
    </Breadcrumb>`;
};
const renderSelect = (configs) => {
    const { style = {}, selectArr = [] } = configs;
    const selectStyle = Object.assign({ width: '100%'}, style);
    return `<Select style={${JSON.stringify(selectStyle)}}>
        ${Array.isArray(selectArr) ? selectArr.map(({ key, label, value }) => {
            return `
                <Option key="${key || value}" value="${value}">
                    ${label}
                </Option>
            `;
            }).join('') : ''}
    </Select>`;
};

const renderTabs = (configs) => {
    const { style = {}, tabsArr = [] } = configs;
    return `<Tabs style={${JSON.stringify(style)}}>
        ${Array.isArray(tabsArr) ? tabsArr.map(({ key, label, value }) => {
            return `<TabPane key="${key || value}"} tab="${label}">
            </TabPane>
            `;
        }).join('') : null
    }
    </Tabs>`;
};

const renderRadio = (configs) => {
    const { style = {}, radioArr = [] } = configs;
    return `<Radio.Group style={${JSON.stringify(style)}}>
        ${Array.isArray(radioArr) ? radioArr.map(({ key, label, value }) => {
            return `<Radio key="${key || value}" value="${value}">
                ${label}
            </Radio>
            `;
        }).join('') : null
        }
    </Radio.Group>`;
};
const renderCheckbox = (configs) => {
    const { style = {}, checkboxArr = [] } = configs;
    const ckStyle = Object.assign({ width: '100%'}, style);
    const optionsStr = JSON.stringify(checkboxArr);
    return `<Checkbox.Group
        options={${optionsStr}}
        style={${JSON.stringify(ckStyle)}}
    />`;
};
const renderDatePicker = (configs) => {
    const { showTime = false, format = 'YYYY-MM-DD' } = configs;
    return `<DatePicker
        style={{ width: '100%' }}
        showTime={${showTime}}
        format="${format}"
    />`;
};

const renderRangePicker = (configs) => {
    const { showTime = false, format = 'YYYY-MM-DD' } = configs;
    return `<RangePicker
        style={{ width: '100%' }}
        showTime={${showTime}}
        format="${format}"
    />`;
}

module.exports = renderWidget;