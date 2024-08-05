import React from "react"
import Edit from './edit';
import { registerBlockType } from "@wordpress/blocks";
import metadata from '../block.json';


registerBlockType(
	'query-search/text-query-form',
	{
		...metadata,
		name: 'query-search/text-query-form',
		title: 'Text Query form',
		edit: Edit,
		save: () => <></>
	}
)




