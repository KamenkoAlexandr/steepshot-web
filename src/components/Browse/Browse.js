import React from 'react';
import {connect} from 'react-redux';
import {documentTitle} from '../../utils/documentTitle';
import PostsList from '../PostsList/PostsList';
import {push, replace} from 'react-router-redux';
import TabsBar from '../Common/TabsBar/TabsBar';
import Tab from '../Common/TabsBar/Tab/Tab';
import {setActiveIndex} from '../../actions/tabsBar';
import Constants from '../../common/constants';
import storage from '../../utils/Storage';
import Utils from '../../utils/Utils';

class Browse extends React.Component {

	componentDidMount() {
		this.setUrlPath.call(this);
		documentTitle();
	}

	componentWillReceiveProps(nextProps) {
		if (Utils.equalsObjects(nextProps.pathname, '/browse')) {
			this.setUrlPath.call(this);
		}
	}

	setUrlPath() {
		let lastActiveIndex =
			Constants.BROWSE_ROUTES[this.props.match.params.filter]
			|| storage.browse;
		lastActiveIndex = parseInt(lastActiveIndex, 10);
		if (!(lastActiveIndex >= 0 && lastActiveIndex <= 2)) {
			lastActiveIndex = 0;
		}
		storage.browse = lastActiveIndex;
		this.props.setActiveIndex('browser', lastActiveIndex);
		this.props.historyReplace('/browse/' + Constants.BROWSE_ROUTES[lastActiveIndex]);
	}

	changeIndex(index) {
		storage.browse = index;
		this.props.historyReplace('/browse/' + Constants.BROWSE_ROUTES[index]);
	}

	render() {
		return (
			<div className="container">
				<div id="workspace" className="g-content">
					<TabsBar point="browser" showLoader={false} changeIndex={this.changeIndex.bind(this)}>
						<Tab name="Hot">
							<PostsList
								point={Constants.POSTS_FILTERS.POSTS_HOT.point}
								wrapperModifier="posts-list offset-should-replace_browse clearfix"
								isComponentVisible={this.props.activeIndex === 0}
							/>
						</Tab>
						<Tab name="New">
							<PostsList
								point={Constants.POSTS_FILTERS.POSTS_NEW.point}
								wrapperModifier="posts-list offset-should-replace_browse clearfix"
								isComponentVisible={this.props.activeIndex === 1}
							/>
						</Tab>
						<Tab name="Top">
							<PostsList
								point={Constants.POSTS_FILTERS.POSTS_TOP.point}
								wrapperModifier="posts-list offset-should-replace_browse clearfix"
								isComponentVisible={this.props.activeIndex === 2}
							/>
						</Tab>
					</TabsBar>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const location = state.router.location || props.location || {};
	return {
		pathname: location.pathname,
		activeIndex: state.tabsBar.browser.activeIndex
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		historyPush: (path) => {
			dispatch(push(path));
		},
		historyReplace: (newPath) => {
			dispatch(replace(newPath));
		},
		setActiveIndex: (point, index) => {
			dispatch(setActiveIndex(point, index));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Browse);
