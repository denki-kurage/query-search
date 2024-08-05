import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";

import metadata from '../block.json';

// @ts-ignore
registerBlockType(
	'query-search/datetime-input-form',
	{
		...metadata,
		name: 'query-search/datetime-input-form',
		title: 'DateTime input form',
		attributes: {
			...metadata.attributes,
			query: {
				type: "string",
				default: ""
			}
		},
		edit: Edit,
		save: () => <p>x</p>
	}
)




