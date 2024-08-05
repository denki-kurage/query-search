import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";

import metadata from '../block.json';

// @ts-ignore
registerBlockType(
	'query-search/list-input-form',
	{
		...metadata,
		name: 'query-search/list-input-form',
		title: 'List input form',
		attributes: {
			...metadata.attributes,
			list: {
				type: "array",
				default: []
			}
		},
		edit: Edit
	}
)






