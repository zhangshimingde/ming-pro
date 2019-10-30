import React, { Component } from 'react';
import { Collapse,Row, Col } from 'antd';
import DragTabFactory from '../../core/DragFactory';
import './index.css';
const { Panel } = Collapse;
class DragTabs extends Component {
	componentDidMount() {

    }

	render() {
		return (
            <div className="DragBox">
                <Collapse className="Drag_Collapse" defaultActiveKey={['1']} >
                    <Panel className="Drag_Panel" header="分类" key="1">
                    <Row gutter={20}>
                        <DragTabFactory/>
                    </Row>
                    </Panel>
                </Collapse>
            </div>
		);
	}
}

export default DragTabs;
