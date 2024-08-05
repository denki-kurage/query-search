import reducer from "./reducer";
import * as selectors from "./selectors";
import * as actions from "./actions";
import * as resolvers from "./resolvers";
import { createReduxStore, dispatch, register, select } from "@wordpress/data";


export const store = createReduxStore(
	'query-search/data',
	{
		reducer,
		selectors,
		actions,
		resolvers
	}
);

register(store);


