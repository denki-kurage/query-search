import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import React from "react";
import { useSelect } from "@wordpress/data";
import { store } from "../store";
import { withQueryFormBlock } from "../blocks/hoc";
import { PropertyContextProvider } from "../base-components/input-forms-property-context";
import { useAttributePropertiesContextValue } from "../hooks/use-properties-context";
import { createInputFormComponents, InputComponentsContextProvider } from "../base-components/input-forms";
import { useMemo } from "@wordpress/element";

const components = createInputFormComponents();

const withCp = createHigherOrderComponent(BlockEdit => props => {
	
	const { name, attributes, setAttributes } = props;
	const { pid } = attributes
	const { getQuerySearchBlockNames, getQueryFormNames, getResultViewName } = useSelect(s => s(store), []);
	const blockNames = getQuerySearchBlockNames();
	const queryFormNames = getQueryFormNames();
	const pv = useAttributePropertiesContextValue(attributes, setAttributes);

	

	if( blockNames.includes(name) )
	{
		const WrapBlockEdit = queryFormNames.includes(name) ?
			useMemo(() => withQueryFormBlock(BlockEdit), [BlockEdit]) : BlockEdit;

		return (
			<InputComponentsContextProvider value={components}>
				<PropertyContextProvider value={pv}>
					<WrapBlockEdit {...props} />
				</PropertyContextProvider>
			</InputComponentsContextProvider>
		)

	}

	return <BlockEdit {...props} />

}, 'withCp')

addFilter(
	'editor.BlockEdit',
	'query-search/with-components-provider',
	withCp
);

