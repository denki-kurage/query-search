import apiFetch from "@wordpress/api-fetch"



export const getAllEndpointArgs = (kind: string, name: string) => async (p) =>
{
	const { dispatch, registry, select, resolveSelect } = p;
	//console.log(select.getQueryFormNames())
	//console.log(resolveSelect);
	const entity = registry.select('core').getEntityConfig(kind, name);
	const path = entity?.baseURL;
	const option = await apiFetch({ path, method: 'OPTIONS' });
	dispatch.setEndpointOption(kind, name, option)
}

