/**
 * @desc 页面右侧容器主视图，拖拽组件的容器
 */
import React, { Component } from 'react';
import { Collapse,Row, Col,Button } from 'antd';
const { Panel } = Collapse;
import './index.css';
import PhoneContainer from '../PhoneContainer';
class MainContainter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layoutConfig:[],
			layoutIndex:0
		};
		this.onDrop = this.onDrop.bind(this);
		this.callBackOrder = this.callBackOrder.bind(this);
		this.container = React.createRef();
	}
	componentDidMount() {
		if (this.container && this.container.current) {
			this.container.current.addEventListener("drop", this.onDrop, false);
		}
	}
	componentWillUnmount() {
		if (this.container && this.container.current) {
			this.container.current.removeEventListener("drop", this.onDrop);
		}
	}
	onDrop(event) {
		event.preventDefault();
		event.stopPropagation();
		const { layoutConfig } = this.state;
		const copyLayoytConfig = layoutConfig.slice();
		const data = JSON.parse(event.dataTransfer.getData('text/plain'));
		copyLayoytConfig.push(data);
		console.log(copyLayoytConfig)
		if(Array.isArray(copyLayoytConfig) && copyLayoytConfig.length > 0){
			copyLayoytConfig.map((el,index)=>{
				el.layoutIndex=index
			})
		}
		this.setState({
			layoutConfig: copyLayoytConfig,
		});
	}
	callBackOrder(items){
		if(Array.isArray(items) && items.length > 0){
			items.map((item,i)=>{
				item.layoutIndex=i
			})
		}
		this.setState({
			layoutConfig: items,
		});
	}
	render() {
		const { layoutConfig } = this.state;
		return (
            <div className="main-containter">
			<Row className="main-row">
				<Col span={20}></Col>
				<Col>
					<Button type="primary" style={{marginRight:'20px'}}>保存</Button>
					<Button type="primary" ghost>预览</Button>
				</Col>
				
			</Row>
			<Row className="main-body" >
				<Col span={24} style={{height:'100%'}}>
					<div ref={this.container} className="phone-box">
						<PhoneContainer 
						layoutConfig={layoutConfig}
						callBackOrder={this.callBackOrder}
						/>	
					</div>
				</Col>
			</Row>
			
            </div>
		);
	}
}

export default MainContainter;
