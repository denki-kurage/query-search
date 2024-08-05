import { Button, Modal, ToolbarButton } from "@wordpress/components";
import React from "react";
import { useOpenCloseContext, withOpenCloseProvider } from "./buttons";


export const ModalOpenButton = withOpenCloseProvider(({ label="???", children }) =>
{
	const { open, close, isOpened } = useOpenCloseContext();
	
	return (
		<>
			<Button className="modal-open-button" label={label} variant="primary" onClick={open} disabled={isOpened}>{label}</Button>
			{ isOpened && <Modal onRequestClose={close} title={label}>{children}</Modal> }
		</>
	)
});


export const ModalToolbarButton = withOpenCloseProvider(({ icon, label, children }) =>
{
	const { isOpened, close, open } = useOpenCloseContext();

	return (
		<>
			<ToolbarButton icon={icon} onClick={open} label={label} disabled={isOpened} />
			{ isOpened && <Modal onRequestClose={close} title={label}>{ children }</Modal> }
		</>
	)
});
	