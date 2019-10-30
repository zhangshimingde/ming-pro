/**
 * @desc 组件
 */
import React, { PureComponent, Fragment } from 'react';
import { Carousel, WingBlank } from 'antd-mobile';
import './Carousel.css';

class Carousels extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				{url:'http://yun.dui88.com/saas/images/template/banner.png'},
				{url:'http://yun.dui88.com/saas/images/template/banner_jianyue.png'},
				{url:''}
			],
			imgHeight: 176,
		};
		// http://yun.dui88.com/saas/images/template/remen_banner@2x.png
	}

	render() {
		return (
			<Fragment>
				<div className="CarouselBox">
					<Carousel
					className="phone-Carousel"
					autoplay={true}
					infinite
					// beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
					// afterChange={index => console.log('slide to', index)}
					>
					{this.state.data.map((val,i) => (
						<img
							key={i}
							src={val.url}
							style={{ width: '100%', verticalAlign: 'top' }}
							onLoad={() => {
							// fire window resize event to change height
							window.dispatchEvent(new Event('resize'));
							this.setState({ imgHeight: 'auto' });
							}}
						/>
					))}
					</Carousel>
				</div>
			</Fragment>
		);
	}
}

export default Carousels;