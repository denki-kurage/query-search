import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";

import metadata from '../block.json';

// @ts-ignore
registerBlockType(
	'query-search/object-input-form',
	{
		...metadata,
		name: 'query-search/object-input-form',
		title: 'Object input form',
		attributes: {
			...metadata.attributes,
			value: {
				type: "object",
				default: {}
			}
		},
		edit: Edit,
		save: () => <p>x</p>
	}
)




