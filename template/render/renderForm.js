const { getProps } = require('../function/propsUtil');
const renderButton = require('./renderButton');

const renderFormItem = (formItemConfig, formItemAlign) => {
    const { type } = formItemConfig;
    const renderWidget = require('./renderWidget');
    if (type === "Button") {
        return `<FormItem>
            ${renderButton(formItemConfig)}
        </FormItem>
        `;
    }
    const { name, label } = formItemConfig;
    if (!name) {
        return '';
    }
    if (formItemAlign === 'r') {
        return `<FormItem label="${label}" labelCol={{span: 6}} wrapperCol ={{span: 14}}>
                {getFieldDecorator("${name}"${getProps(formItemConfig, 'FormItem')})(
                    ${renderWidget(formItemConfig)}
                )}
            </FormItem>
        `;
    }
    return `<FormItem label="${label}">
            {getFieldDecorator("${name}"${getProps(formItemConfig, 'FormItem')})(
                ${renderWidget(formItemConfig)}
            )}
        </FormItem>
    `;
};

const renderForm = (configs) => {
    const { formItemArr = [], layoutColumn = 1, formItemAlign } = configs;
    return `<Form onSubmit={this.onSubmit} layout="inline">
                <Row gutter={{ md: ${24/layoutColumn}, lg: 24, xl: 48 }}>
                    ${Array.isArray(formItemArr) && formItemArr.map((formItemConfig) => {
                        return `<Col md={${formItemConfig.colSpan || 8}} sm={24}>
                                ${renderFormItem(formItemConfig, formItemAlign)}
                    </Col>
                    `;
                    }).join('')}
                </Row>
        </Form>
    `;
};

module.exports = renderForm;