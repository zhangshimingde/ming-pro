import React, { PureComponent, Fragment } from 'react';
import { Divider } from 'antd';
import Dragable from './Dragable';
import dargConfig from '../util/dragConfig';

class DragTabFactory extends PureComponent {
	renderContentByType(targetConfigs, type = '') {
		return (
			<Fragment key={`${type}`}>
				{
					type ? (<Divider key={`${type}`}>{type}</Divider>) : null
				}
				{
					targetConfigs.map((config, index) => {
						return (
							<Dragable {...config} key={`drag-${config.ch}-${index}`} />
						);
					})
				}
			</Fragment>
		);
	}
	render() {
		const { tabType = 'component' } = this.props;
        const targetConfigs = dargConfig[tabType] || [];
		if (Array.isArray(targetConfigs)) {
			return this.renderContentByType(targetConfigs);
		} else {
			return Object.keys(targetConfigs).map((k) => {
				if(Array.isArray(targetConfigs[k])) {
					return this.renderContentByType(targetConfigs[k], k);
				}
				return null;
			});
		}
	}
}

export default DragTabFactory;