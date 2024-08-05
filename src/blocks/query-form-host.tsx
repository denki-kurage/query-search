import { useSelect } from "@wordpress/data"
import React from "react";
import { PropertyContextProvider } from "../base-components/input-forms-property-context";
import { useAttributePropertiesContextValue } from "../hooks/use-properties-context";

export const QueryFormHost = (props) =>
{
	const { name, attributes, setAttributes } = props;

	// @ts-ignore
	const blockType = useSelect(s => s('core/blocks').getBlockType(name), []);
	const Component = blockType?.edit;

	const pv = useAttributePropertiesContextValue(attributes, setAttributes);

	if(!Component)
	{
		return null;
	}

	return (
		<PropertyContextProvider value={pv}>
			<Component {...props} />
		</PropertyContextProvider>
	)
}

export default QueryFormHost;
