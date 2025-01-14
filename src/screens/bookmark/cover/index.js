import t from 't'
import React from 'react'
import Navigation from 'modules/navigation'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bookmarksActions from 'data/actions/bookmarks'
import { makeDraftItem, makeCovers, makeHaveScreenshot } from 'data/selectors/bookmarks'

import {
	CoversView,
	CoverView,
	CoverCheckView,
	CoverCheck,
	CoverTap,
	CoverScreenshotView,
	CoverScreenshotText
} from './style'
import Cover from 'co/common/cover'

const checkedIcon = <CoverCheckView><CoverCheck source={require('assets/images/selectFilled.png')} /></CoverCheckView>
const coverStyle = {borderRadius: 2, overflow: 'hidden'}

class BookmarkCoverScreen extends React.Component {
	static defaultProps = {
        _id: 0
    }

	static options() {
		return {
			topBar: {
				title: {
					text: t.s('cover')
				},
				backButton: {
					showTitle: true
				}
			}
		}
    }

    onClose = ()=>
        Navigation.close(this.props)
    
    onChange = (coverId)=>{
		if (this.props.item.coverId != coverId){
			this.props.actions.bookmarks.draftChange(this.props.item._id, { coverId })
			this.props.actions.bookmarks.draftCommit(this.props.item._id)
		}
        this.onClose()
    }

    onScreenshot = ()=>{
        this.props.actions.bookmarks.oneScreenshot(this.props.item._id)
        this.onClose()
    }

	getCovers = makeCovers()

	renderImageItem = (item)=>(
		<CoverTap onPress={()=>this.onChange(parseInt(item._id))}>
			<CoverView active={item._id==this.props.item.coverId}>
				{item._id==this.props.item.coverId ? checkedIcon : null}
				<Cover style={coverStyle} images={this.getCovers(item.link, this.props.item.domain)} size='grid' />
			</CoverView>
		</CoverTap>
	)

	renderScreenshotItem = ()=>(
		<CoverTap onPress={this.onScreenshot}>
			<CoverScreenshotView>
				<CoverScreenshotText>{_.capitalize(t.s('screenshot'))}</CoverScreenshotText>
			</CoverScreenshotView>
		</CoverTap>
	)

	renderItem = ({item})=>(
		item.type == 'screenshot' ? this.renderScreenshotItem() : this.renderImageItem(item)
	)

	render() {
		const items = _.map(this.props.item.media, (item,index)=>({...item, type:'image', _id: index, key: 'i'+index}))
		if (!this.props.haveScreenshot)
			items.unshift({
				type: 'screenshot',
				_id: 's',
				key: 's'
			})

		return (
			<CoversView 
				data={items}
				numColumns={3}
				renderItem={this.renderItem} />
		)
	}
}

export default connect(
	() => {
        const getDraftItem = makeDraftItem()
        const getHaveScreenshot = makeHaveScreenshot()
    
        return (state, {_id})=>({
            item: getDraftItem(state, {_id}),
            haveScreenshot: getHaveScreenshot(state, _id)
        })
    },
	(dispatch)=>({
		actions: {
			bookmarks: bindActionCreators(bookmarksActions, dispatch)
		}
	})
)(BookmarkCoverScreen)