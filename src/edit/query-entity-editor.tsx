import React from "react";
import { useInputFormContext } from "../base-components/input-forms";
import { useSelect } from "@wordpress/data";



export const EntityEditor = ({kind, name}) =>
{
	const { Select } = useInputFormContext();


	// @ts-ignore
	const configs = useSelect(s => s('core').getEntitiesConfig(kind), [kind]);

	// @ts-ignore
	const config = useSelect(s => s('core').getEntityConfig(kind, name), [kind, name]);


	
	const kindOptions = ['postType', 'taxonomy', 'root'].map(x => ({label: x, value: x}))
	const postTypeOptions = configs.map(c => ({label: `${c.label}(${c.name})`, value: c.name}));
	
	

	return (
			<div>
				<Select name="kind" options={kindOptions} />
				<Select name="name" options={postTypeOptions} />
				{ config && 
					<div>
						<p>baseURL: {config?.baseURL}</p>
						<p>label: {config?.label}</p>
					</div>
				}
			</div>
	);
};


	