import Immutable from 'seamless-immutable'
import items from './items'
import groups from './groups'
import single from './single'
import drafts from './drafts'
import colors from './colors'
import defaults from './defaults'

export default function(state = initialState, action={}){
	//Items
	const caseItems = items(state,action);
	if (caseItems) state = caseItems;

	//Groups
	const caseGroups = groups(state,action);
	if (caseGroups) state = caseGroups;

	//Single
	const caseSingle = single(state,action);
	if (caseSingle) state = caseSingle;

	//Drafts
	const caseDrafts = drafts(state,action);
	if (caseDrafts) state = caseDrafts;

	//Colors
	const caseColors = colors(state,action);
	if (caseColors) state = caseColors;

	//Defaults
	const caseDefaults = defaults(state,action);
	if (caseDefaults) state = caseDefaults;

	switch (action.type) {
		case 'RESET':{
			return initialState
		}
	
		default:
			return state;
	}
}

const initialState = Immutable({
	status: 'idle', /* idle, loading, loaded, error */
	items: {},
	groups: [],
	blankChildInParent: 0, //parentId where show blank child

	colors: {},
	drafts: {},

	defaults: [
		{
			_id: 0,
			title: 'All',
			view: 'list'
		},
		{
			_id: -1,
			title: 'Unsorted',
			view: 'list'
		},
		{
			_id: -3,
			title: 'Readlater',
			view: 'list'
		},
		{
			_id: -99,
			title: 'Trash',
			view: 'list'
		}
	],

	defaultGroupTitle: 'My Collections'
})