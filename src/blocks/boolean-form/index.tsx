import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";

import metadata from '../block.json';

// @ts-ignore
registerBlockType(
	'query-search/boolean-input-form',
	{
		...metadata,
		name: 'query-search/boolean-input-form',
		title: 'Boolean input form',
		attributes: {
			...metadata.attributes,
			query: {
				type: "boolean",
				default: false
			}
		},
		edit: Edit,
		save: () => <p>x</p>
	}
)




