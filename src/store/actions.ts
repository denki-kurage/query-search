
export const setResultViewName = (rvName: string) =>
{
	return ({
		type: 'SET_RESULT_VIEW_NAME',
		name: rvName
	})
}

export const addQueryFormName = (qfName: string) =>
{
	return ({
		type: 'ADD_QUERY_FORM_NAME',
		name: qfName
	})
}

export const setEndpointOption = (kind, name, option) =>
{
	return ({
		type: 'SET_ENDPOINT_OPTION',
		kind,
		name,
		option
	})
}
