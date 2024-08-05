import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";

import metadata from '../block.json';

// @ts-ignore
registerBlockType(
	'query-search/array-input-form',
	{
		...metadata,
		name: 'query-search/array-input-form',
		title: 'Array input form',
		attributes: {
			...metadata.attributes,
			list: {
				type: "array",
				default: []
			}
		},
		edit: Edit,
		save: () => <p>x</p>
	}
)




