/**
 * @desc 可拖拽组件抽象类
 */
import React, { PureComponent } from 'react';
import { Col } from 'antd';
class Dragable extends PureComponent {
	onDragStart(e, data) {
		e.dataTransfer.setData('text/plain',JSON.stringify(data));
	}
	render() {
		const { modules,data} = this.props;
		return (
			<Col className="DragCol drag-item" span={11} offset={1} draggable="true" onDragStart={(e) => { this.onDragStart(e, data); }}>
				{modules}
			</Col>
		);
	}
}

export default Dragable;