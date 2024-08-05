import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import React, { useState } from "react"
import { useColumns } from "./hooks";
import { Spinner } from "@wordpress/components";

export default ({ kind, name, items, totalItems, totalPages, isLoading }) =>
{
	const [ paginationModel, setPaginationModel ] = useState({
		pageSize: 10,
		page: 1
	});
	const pageSizeOptions = [10, 20, 30, 50, 100];
	const { page, pageSize } = paginationModel;


	const { flatItems, itemsColumnNames } = useColumns(items, [items]);
	const columns = itemsColumnNames.map(n => ({ field: n, headerName: n}));

	const warning = (() => {
		if(isLoading)
		{
			return <Spinner />
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


	return (
		<div style={{ width: '100%', height: 600 }}>
			<DataGrid
				paginationMode="server"
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
				pageSizeOptions={pageSizeOptions}
				columns={columns}
				rows={flatItems}
				rowCount={totalItems}
				loading={isLoading}
				slots={{
					toolbar: GridToolbar
				}}
				/>
		</div>
	)
}