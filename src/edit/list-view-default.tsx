import { Spinner } from "@wordpress/components";
import { useColumns } from "./hooks";
import { useState } from "@wordpress/element";
import React from "react";
import QueryPagination from "./query-pagination";
import { ListViewCommands } from "./list-view-commands";

export default ({ kind, name, items, totalItems, totalPages, isLoading }) =>
{

	const warning = (() => {
		if(isLoading)
		{
			return <Spinner />
		}

		if(!items)
		{
			return <p>エンティティを選んでください。</p>
		}

		if(items.length === 0)
		{
			return <p>アイテムがありませんでした。</p>
		}
	})();

	if(warning)
	{
		return <div className="query-search-list-view-warning">{warning}</div>
	}


	
	const { itemsColumnNames, flatItems } = useColumns(items, [items]);
	const [ page, setPage ] = useState(1);

	const columnsCount = itemsColumnNames.length;


	return (
		<div className="query-search-list-view-table">
		<table style={{width: '100%'}}>
			<thead>
				<tr>
					<td colSpan={columnsCount + 1}>
						<QueryPagination
							totalItems={totalItems}
							totalPages={totalPages}
							page={page}
							onPageChanged={setPage}
							/>
					</td>
				</tr>
				<tr>
					{
						itemsColumnNames.map(n => <td key={n}>{n}</td>)
					}
					<td key="commands">commands</td>
				</tr>
			</thead>
			<tbody>
				{
					flatItems.map(fi => {
						const fields = itemsColumnNames.map(n => <td key={n}>{fi?.[n] ?? 'x'}</td>);
						return <tr key={fi?.id}>{fields}<td><ListViewCommands kind={kind} name={name} id={fi?.id} /></td></tr>
					})
				}
			</tbody>
			<tfoot>
				<tr>
					<td colSpan={columnsCount + 1}>
						<QueryPagination
							totalItems={totalItems}
							totalPages={totalPages}
							page={page}
							onPageChanged={setPage}
							/>
					</td>
				</tr>
			</tfoot>
		</table>
		</div>
	)
}




	
	
	