import React, { Component, Fragment } from 'react';
import { Collapse,Row, Col,Button } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.css';
import '../../../util/js/taobao';
import Carousel from '../../ModalContainer/Carousel';
import SortList from '../../ModalContainer/SortList';
import EmptyContainer from  '../EmptyContainer';
import ListView from '../../ModalContainer/ListView';
class  PhoneContainer extends Component {
    constructor(props) {
		super(props);
		this.state = {
            showEmptyContainer:false,
		};
    }
    
    componentDidMount(){
        const _this=this;
        /* 放置目标元素时触发事件 */
        document.addEventListener("dragover", function( event ) {
            // 阻止默认动作以启用drop
            event.preventDefault();
        }, false);

        /* 拖动目标元素时触发drag事件 */
        document.addEventListener("drag", function( event ) {

        }, false);

        document.addEventListener("dragstart", function( event ) {
                // 使其半透明
                event.target.style.opacity = .5;
        }, false);

        document.addEventListener("dragend", function( event ) {
            // 重置透明度
            event.target.style.opacity = "";
            let Dom = document.querySelectorAll('.CarouselBox');
            document.querySelectorAll('.CarouselBox').forEach((t,i) => {
                if(i==Dom.length-1){
                    t.style.border = "1px dashed #29b6b0";
                }else{
                    t.style.border = "0";
                }
            })
            _this.setState({
                showEmptyContainer:false
            })
        }, false);

        document.addEventListener("dragenter", function( event ) {
            // 当可拖动的元素进入可放置的目标时高亮目标节点
            if ( event.target.className === "phone-containter") {
                _this.setState({
                    showEmptyContainer:true
                })
            }
        }, false);

        document.addEventListener("dragleave", function( event ) {
            // 当拖动元素离开可放置目标节点，重置其背景
            if ( event.target.className === "phone-containter" ) {
                _this.setState({
                    showEmptyContainer:false
                })
            }
        }, false);
    }
   
    renderContainer(){
        const { layoutConfig } = this.props;
        let DOM=[];
        if (Array.isArray(layoutConfig) && layoutConfig.length > 0) {
            layoutConfig.map((config,index)=>{
                const {layoutIndex,type }=config;
                if(type==='BANNER'){
                    DOM.push(<Carousel/>)
                }else if(type==='GOODSSORT'){
                    DOM.push(<SortList/>)
                }else if(type==='LISTVIEW'){
                    DOM.push(<ListView/>)
                }
            })
        }
        return DOM;
    }

    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

    onDragEnd = result => {
		if (!result.destination) return;
        const items = this.reorder(this.props.layoutConfig, result.source.index, result.destination.index);
		this.props.callBackOrder && this.props.callBackOrder(items);
	};

	render() {
        const {showEmptyContainer } =this.state;
        const getItemStyle = (isDragging, draggableStyle) =>{
            return {
                userSelect: 'none',
                ...draggableStyle
            }
        };
		return (
            <div className="phone-containter">
                <div className="title">
                    <img src={require('../../../assets/img/phone_status_bar.png')} alt=""/>
                </div>
                <div className="header clearfix">
                    <span className="phone-header-left">
                        <i className="iconfont icon-fanhui handle-zuo"></i>
                    </span>
                    <span className="titleNames">1</span>
                    <span className="phone-header-right">
                        <i className="iconfont icon-gengduo handle-faction_share"></i>
                    </span>
                </div>
                <Fragment >
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} 
                                    {...provided.droppableProps}>
                                        {this.renderContainer().map((item, index) => { // children_list 父组件传递过来的Element
                                            if (React.isValidElement(item)) { // 判断是否是ReactNode节点
                                                return (
                                                    <Draggable key={index} draggableId={`item-${index}`} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}// 需要处理判断进行的样式返回
                                                            >
                                                                {item}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            }
                                            return item;
                                        })}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        {showEmptyContainer&&<EmptyContainer/>}
                </Fragment>
            </div>
		);
	}
}

export default PhoneContainer;
