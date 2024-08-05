import { useMemo, useState } from "@wordpress/element";
import React from "react"
import { flatColumns, getAllFlatColumnNames, useColumns } from "./hooks";






export const ColumnsView = ({items}) =>
{
	const [ filters, setFilters ] = useState([]);
	const { itemsColumnNames } = useColumns(items, [items, filters]);

	return <View columns={itemsColumnNames} filters={filters} onFiltersChanged={setFilters} />
}

const View = ({ columns, filters, onFiltersChanged }) =>
{
	const checkChange = (column, checked) =>
	{
		const s = new Set(filters);
		if (!checked)
		{
			s.add(column);
		}
		else {
			s.delete(column);
		}

		onFiltersChanged([...s.values()]);
	};
	return (
		<div>
			{columns.map((column) => (
				<Check
				key={column}
				column={column}
				checked={!filters.includes(column)}
				change={checkChange}
				/>
			))}
		</div>
	);
  };
  
const Check = ({ column, checked, change }) =>
{
	return (
		<div>
			<input
			type="checkbox"
			checked={checked}
			onChange={(e) => change(column, e.target.checked)}
			/>
			{column}
		</div>
	);
};


