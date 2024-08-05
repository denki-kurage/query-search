import { useMemo, useState } from "@wordpress/element";
import { PropertyContextProvider } from "../base-components/input-forms-property-context";
import React from "react";




export const useAttributePropertiesContextValue = ( attributes, setAttributes ) =>
{
	return useMemo(() => {
		return ({
			properties: attributes,
			setProperty: (n, v) => setAttributes({[n]: v})
		})
	}, [attributes, setAttributes]);
}


export const useStatePropertiesContextValue = (defaultValue = {}) =>
{
	const [obj, setObj] = useState(defaultValue);

	return useMemo(() => {
		return ({
			properties: obj,
			setProperty: (n, v) => setObj({[n]: v})
		})
	}, [obj]);

}

export const useEntityStatePropertiesProvider = (value, onValueChanged) =>
{
	return useMemo(() => {
		return ({
			properties: value,
			setProperty: (n, v) => onValueChanged({[n]: v})
		})
	}, [value, onValueChanged]);
}

