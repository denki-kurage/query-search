import { createHigherOrderComponent } from "@wordpress/compose";
import { InputFormProps, useFormAddStates, useFormDeleteState, useFormEditStates } from "../hooks/use-entity-state";
import { useDispatch } from "@wordpress/data";
import { useEffect, useMemo } from "@wordpress/element";
import { useOpenCloseContext } from "./buttons";
import React from "react";
import { store as noticesStore } from "@wordpress/notices";
import { PropertyContextProvider } from "./input-forms-property-context";
import { Button, ButtonGroup, Spinner } from "@wordpress/components";
import { useEntityStatePropertiesProvider } from "../hooks/use-properties-context";


export interface ModalContainerProps extends InputFormProps
{
	label: string;
	children: any;
}

export type FormComponentProps = { value: object, onValueChanged: (value: object) => void }
export type FormComponentType = (props: FormComponentProps) => JSX.Element;

export type InputFormAddArgs = [ name: string, kind: string ];
export type InputFormEditArgs = [id: number|string, ...InputFormAddArgs];

export type InputFormAddProps = { name?: string, kind?: string };
export type InputFormEditProps = { id: number|string, name?: string, kind?: string };

export const withAddPostForm = createHigherOrderComponent((FormComponent: FormComponentType) => (props: InputFormAddProps) => {
	const { name, kind } = props;
	const options = useFormAddStates(name, kind);
	const { value, onValueChanged } = options;
	const pv = useEntityStatePropertiesProvider(value, onValueChanged);

	return (
		<PropertyContextProvider value={pv}>
			<EntityModalContainer label="追加" {...options}>
				<FormComponent {...options} />
			</EntityModalContainer>	
		</PropertyContextProvider>

	);
}, 'withAddPostForm');

export const withEditPostForm = createHigherOrderComponent((FormComponent: FormComponentType) => (props: InputFormEditProps) => {
	const { id, name, kind } = props;
	const options = useFormEditStates(id, name, kind);
	const { value, onValueChanged } = options;
	const pv = useEntityStatePropertiesProvider(value, onValueChanged);

	return (
		<PropertyContextProvider value={pv}>
			<EntityModalContainer label="編集" {...options}>
				<FormComponent {...options} />
			</EntityModalContainer>
		</PropertyContextProvider>

	)
}, 'withEditPostForm');

export const withDeletePostButton = createHigherOrderComponent((MessageComponent) => (props: InputFormEditProps) => {
	const { id, name, kind } = props;
	const options = useFormDeleteState(id, name, kind);
	const { lastError, execute } = options;

	const { createErrorNotice, createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		if(lastError)
		{
			createErrorNotice(lastError, { type: 'snackbar' });
		}
	}, [lastError])

	return (
		<EntityModalContainer label="削除" {...options}>
			<MessageComponent {...options} />
		</EntityModalContainer>
	)
}, 'withDeletePostButton');


export const EntityModalContainer = (props: ModalContainerProps) =>
{
	const { lastError, isExecuting, hasEdits, execute, cancel } = props;
	const { label, children } = props as any;

	const { close } = useOpenCloseContext();

	return (
		<>
			{ lastError && <h2>{lastError}</h2> }

			{children}

			<AsyncExecutionButton
				execute={execute}
				cancel={cancel}
				onExecuted={close}
				onCanceled={close}
				isExecuting={isExecuting}
				isEnabled={hasEdits}

				executeContent={label}
				executingContent={`${label}...`}
				closeContent="閉じる"
			/>
		</>
	)
}


interface AsyncExecutionButtonProps
{
	isExecuting: boolean;
	isEnabled?: boolean;
	execute: () => Promise<void>;
	cancel?: () => Promise<void>;

	onExecuted?: () => void;
	onCanceled?: () => void;
	onFaulted?: (ex) => void;

	executingContent?: JSX.Element|string;
	executeContent?: JSX.Element|string;
	closeContent?: JSX.Element|string
}

/**
 * 非同期実行ボタン及び閉じるボタンを実装します。
 */
export const AsyncExecutionButton = ({
	execute, cancel, onExecuted, onCanceled, onFaulted,
	isExecuting, isEnabled = true,
	executingContent = "実行中", executeContent="実行", closeContent="閉じる" }: AsyncExecutionButtonProps) =>
{

	const wrapExecute = async () => {
		try
		{
			await execute();
			onExecuted?.();
		}
		catch(ex)
		{
			onFaulted?.(ex);
		}
	};

	const wrapCancel = async () => {
		try
		{
			if(cancel)
			{
				await cancel();
				onCanceled?.();
			}
		}
		catch(ex)
		{
			onFaulted?.(ex);
		}
	}
	
	return (
		<ButtonGroup>
			<Button variant="primary" onClick={wrapExecute} disabled={!isEnabled || isExecuting}>
				{isExecuting ? <><Spinner />{executingContent}</> : executeContent}
			</Button>

			{cancel &&
				<Button variant="tertiary" onClick={wrapCancel} disabled={isExecuting}>
					{closeContent}
				</Button>
			}
		</ButtonGroup>
	)
};
