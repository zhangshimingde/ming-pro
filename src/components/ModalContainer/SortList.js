/**
 * @desc 分类组件
 */
import React, { PureComponent, Fragment } from 'react';
import { Grid } from 'antd-mobile';
import './SortList.css';

class SortList extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			imgHeight: 176,
		};
	
	}

	render() {
        const data = Array.from(new Array(9)).map((_val, i) => ({
            icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
            text: `name${i}`,
        }));
		return (
			<Fragment>
				<div className="CarouselBox">
                    <Grid data={data} hasLine={false} />
				</div>
			</Fragment>
		);
	}
}

export default SortList;