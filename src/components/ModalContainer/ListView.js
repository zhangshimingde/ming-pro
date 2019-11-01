/**
 * @desc 组件
 */
import React, { PureComponent, Fragment } from 'react';
import ReactDOM  from 'react-dom';
import { ListView,PullToRefresh } from 'antd-mobile';
import './ListView.css';


class ListViews extends PureComponent {
	constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
		this.state = {
			dataSource,
            isLoading: true,
            NUM_ROWS :20,
            pageIndex : 0,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false,
            data : [
                {
                  img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
                  title: 'Meet hotel',
                  des: '不是所有的兼职汪都需要风吹日晒',
                },
                {
                  img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
                  title: 'McDonald\'s invites you',
                  des: '不是所有的兼职汪都需要风吹日晒',
                },
                {
                  img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
                  title: 'Eat the week',
                  des: '不是所有的兼职汪都需要风吹日晒',
                },
            ]
		};
    }
    componentDidUpdate() {
        if (this.state.useBodyScroll) {
          document.body.style.overflow = 'auto';
        } else {
          document.body.style.overflow = 'hidden';
        }
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        setTimeout(() => {
          this.rData = this.genData();
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            height: hei,
            refreshing: false,
            isLoading: false,
          });
        }, 1500);
    }

    onRefresh = () => {
        this.setState({ refreshing: true, isLoading: true });
        // simulate initial Ajax
        setTimeout(() => {
          this.rData = genData();
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
          });
        }, 600);
    };

    genData(pIndex = 0) {
        const dataBlob = {};
        for (let i = 0; i < this.state.NUM_ROWS; i++) {
          const ii = (pIndex * this.state.NUM_ROWS) + i;
          dataBlob[`${ii}`] = `row - ${ii}`;
        }
        return dataBlob;
    }

    onEndReached = (event) => {
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        this.setState({ isLoading: true });
        setTimeout(() => {
          this.rData = { ...this.rData, ...this.genData(++this.state.pageIndex) };
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
          });
        }, 1000);
    }

	render() {
        const {data }=this.state;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
              index = data.length - 1;
            }
            const obj = data[index--];
            return (
              <div key={rowID} style={{ padding: '0 15px',backgroundColor: 'white', }}>
                <div
                  style={{
                    lineHeight: '50px',
                    color: '#888',
                    fontSize: 18,
                    borderBottom: '1px solid #F6F6F6',
                  }}
                >{obj.title}</div>
                <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                  <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
                  <div style={{ lineHeight: 1 }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
                    <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowID}</span>¥</div>
                  </div>
                </div>
              </div>
            );
        };
        const separator = (sectionID, rowID) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F9',
                height: 8,
                borderTop: '1px solid #ECECED',
                borderBottom: '1px solid #ECECED',
              }}
            />
        );
        let index = data.length - 1;
		return (
			<Fragment>
				<div >
                    <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? 'Loading...' : 'Loaded'}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={4}
                    onScroll={() => { console.log('scroll'); }}
                    scrollRenderAheadDistance={100}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    useBodyScroll={this.state.useBodyScroll}
                    style={this.state.useBodyScroll ? {} : {
                      height: this.state.height,
                      border: '1px solid #ddd',
                      margin: '5px 0',
                    }}
                    pullToRefresh={<PullToRefresh
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh}
                    />}
              />
				</div>
			</Fragment>
		);
	}
}

export default ListViews;