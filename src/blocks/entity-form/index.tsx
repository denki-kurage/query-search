import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";

import metadata from '../block.json';

// @ts-ignore
registerBlockType(
	'query-search/entity-input-form',
	{
		...metadata,
		name: 'query-search/entity-input-form',
		title: 'Entity input form',
		attributes: {
			...metadata.attributes,
			kind: {
				type: "string",
				default: "postType"
			},
			name: {
				type: "string",
				default: "post"
			}
		},
		edit: Edit,
		save: () => <p>x</p>
	}
)




