import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";

import metadata from '../block.json';

// @ts-ignore
registerBlockType(
	'query-search/number-input-form',
	{
		...metadata,
		name: 'query-search/number-input-form',
		title: 'Number input form',
		attributes: {
			...metadata.attributes,
			query: {
				type: "number",
				default: 0
			}
		},
		edit: Edit
	}
)






