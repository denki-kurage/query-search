import React from "react"
import { useLoadEntityState } from "../hooks/use-entity-state"
import { useEntityRecords } from "@wordpress/core-data"
import { getQueries, useColumns, useEntityColumns } from "./hooks"
import { useState } from "@wordpress/element"

//import ListViewComponent from './list-view-default';
import ListViewComponent from './list-view-mui-data-grid-version'

export const ListView = ({kind, name, uid}) =>
{
	const { queries } = getQueries(kind, name, uid);


	if(!queries.per_page)
	{
		queries['per_page'] = 5;
	}


	const { items, isLoading } = useLoadEntityState(name, kind, queries);
	const { totalItems, totalPages } = useEntityRecords(kind, name, queries);

	const warning = (() => {
		if(!items)
		{
			return <p>エンティティを選んでください。</p>
		}
	})();

	if(warning)
	{
		return <div className="query-search-list-view-warning">{warning}</div>
	}

	return (
		<ListViewComponent
			kind={kind}
			name={name}
			items={items}
			isLoading={isLoading}
			totalItems={totalItems}
			totalPages={totalPages} 
		/>
	)

	
}
