import { combineReducers } from "@wordpress/data";


export interface IBlockDefines
{
	resultViewName: string;
	queryFormNames: string[];
}

const defaultState: IBlockDefines =
{
	resultViewName: '',
	queryFormNames: []
}
const blockDefines = (state: IBlockDefines = defaultState, action) =>
{
	switch(action.type)
	{
		case "SET_RESULT_VIEW_NAME":
			return ({ ...state, resultViewName: action.name })
		case "ADD_QUERY_FORM_NAME":
			const name = action.name;
			const forms = state.queryFormNames;
			if(!forms.includes(name))
			{
				return ({ ...state, queryFormNames: [...forms, name]});
			}
	}

	return state;
}


interface ISchemas
{
	options: {[key: string]: any}
}
const schemas = (state: ISchemas = { options: [] }, action) =>
{
	switch(action.type)
	{
		case 'SET_ENDPOINT_OPTION':
			const { options } = state;
			const { kind, name, option } = action;
			options[[kind, name].join(':')] = option;
			return ({...state, options})
	}

	return state;
}

const reducer = combineReducers({ blockDefines, schemas });
export type StateType = ReturnType<typeof reducer>;
export default reducer;



