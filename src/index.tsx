
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit/edit';
import save from './save';
import metadata from './block.json';
import { store } from './store';
import { dispatch } from '@wordpress/data';
import blockNames from './blocks/block-names';

import './blocks';
import './base-components';
import './filters';

dispatch(store).setResultViewName('query-search/result-view');
blockNames.map(bn => dispatch(store).addQueryFormName(bn));

// @ts-ignore
registerBlockType( 'query-search/result-view', {
	...metadata,
	title: 'Query Search',
	//description: 'RV',
	category: 'text',
	edit: Edit,

	save,
} );





