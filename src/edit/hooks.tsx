import { useSelect } from "@wordpress/data";
import { store } from "../store";
import { addQueryArgs } from "@wordpress/url";
import { useMemo } from "@wordpress/element";
import { useLoadEntityState } from "../hooks/use-entity-state";

export const blocksToGroupByField = (blocks) =>
{
	const m = [];

	for(const block of blocks)
	{
		const field = block.attributes.field;
		if(field)
		{
			const arr = m[field] ?? [];
			// @ts-ignore
			m[field] = [...arr, block];
		}
	}

	return m;
}

export const getQueries = (kind, name, uid) =>
{
	// @ts-ignore
	const baseURL = useSelect(s => s('core').getEntityConfig(kind, name)?.baseURL, [kind, name]);
	const blocks = useSelect(s => s(store).getQueryFormsByResultView(uid), [kind, name, uid]);
	const enabledBlocks = blocks.filter(b => b.attributes?.enabled);
	const enabledAttributes = enabledBlocks.map(b => b.attributes);
	const queries = enabledAttributes.reduce((pre, cur) => ({...pre, [cur?.field]: cur?.query}), {});
	const queryString = addQueryArgs(baseURL ?? '', queries);
	
	return ({ blocks, queries, baseURL, queryString })
}


export const flatColumns = (item, columns = {}, deps: string[] = []) => {
	for (const [key, value] of Object.entries(item))
	{
		if (typeof value === "object")
		{
			deps.push(key);
			flatColumns(value, columns, deps);
			deps.pop();
		}
		else
		{
			const newKey = [...deps, key].join(".");
			columns[newKey] = value;
		}
	}
	return columns;
  };
  
export const getAllFlatColumnNames = (items) =>
{
	const columns = new Set<string>();
	for (const item of items)
	{
		const line = flatColumns(item);
		Object.keys(line).forEach((l) => columns.add(l));
	}
	return [...columns.keys()];
};





export const useColumns = (items, deps) => {
	return useMemo(() => {
		const itemsColumnNames = getAllFlatColumnNames(items);
		const flatItems = items.map((item) => flatColumns(item));

		return { itemsColumnNames, flatItems };
	}, deps);
};

export const useEntityColumns = (kind, name, queries) =>
{
	const { items, isLoading } = useLoadEntityState(name, kind, queries);
	const r = useColumns(items, [items]);
	return { ...r, items }
}

export const useAllEndpointArgs = (kind, name) =>
{
	const args = useSelect(s => s(store).getAllEndpointArgs(kind, name), [kind, name]);
	const fields = [...Object.keys(args)];

	// @ts-ignore
	const options = Object.entries(args).map(([k, v]) => ({ label: `${k} : ${v?.description}`, value: k }));
	return { args, fields, options }
}

export const resolveQueryFormByEndpointArgs = args =>
{


	
}
