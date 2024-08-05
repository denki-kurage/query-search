import { Button, ButtonGroup, Modal, Spinner, TextControl } from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import { ComponentType, useEffect, useMemo } from "@wordpress/element";

import React, { createContext, useContext, useState } from "react";

export interface OpenCloseContextProps
{
	isOpened: boolean;
	open: () => void;
	close: () => void;
	closed?: () => void;
}
const OpenCloseContext = createContext<OpenCloseContextProps>({
	isOpened: false,
	open: () => {},
	close: () => {}
});

export const OpenCloseContextProvider = OpenCloseContext.Provider;
export const OpenCloseContextConsumer = OpenCloseContext.Consumer;
export const useOpenCloseContext = () => useContext(OpenCloseContext);



export const OpenCloseProvider = ({children}) =>
{
	const [isOpened, setIsOpened] = useState(false);
	const open = () => setIsOpened(true);
	const close = () => { setIsOpened(false); }

	const value: OpenCloseContextProps =
	{
		isOpened,
		open,
		close
	}

	return (
		<OpenCloseContextProvider value={value}>
			{children}
		</OpenCloseContextProvider>
	)

}

export const withOpenCloseProvider = createHigherOrderComponent((Origin) => props =>
{
	return (
		<OpenCloseProvider>
			<Origin {...props} />
		</OpenCloseProvider>
	)
}, 'withOpenCloseProvider');


