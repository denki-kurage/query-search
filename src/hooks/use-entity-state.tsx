import React, { useState, useEffect } from "react"


import { store as coreDataStore } from "@wordpress/core-data";
import { useDispatch, useSelect } from "@wordpress/data";





export interface InputFormProps
{
	hasEdits: boolean;
	lastError: string|undefined;
	isExecuting: boolean;
	value: object;
	onValueChanged: (value: any) => void;
	execute: () => Promise<void>;
	cancel: () => Promise<void>;
}


export const useFormAddStates = (name = 'post', kind = 'postType') =>
{
	const params = [kind, name] as any as [string, string, any];

	const [ value, setValue ] = useState<object>({});
	const { saveEntityRecord } = useDispatch(coreDataStore);
	const { lastError, isExecuting } = useSelect(select => {
		
		const s = select(coreDataStore);

		return ({
			lastError: s.getLastEntitySaveError(...params),
			isExecuting: s.isSavingEntityRecord(...params),
			// saveEntityRecord: (edits: any) => saveEntityRecord(...params, edits)
		})
	}, []);


	const execute = async () =>
	{
		// @ts-ignore
		if( await saveEntityRecord(...params, { ...value }) )
		{
			return;
		}

		throw new Error(lastError);
	}

	const cancel = async () => {}

	const r: InputFormProps =
	{
		hasEdits: true,
		lastError,
		isExecuting,
		value,
		onValueChanged: setValue,
		execute,
		cancel,
	};

	return r;
}

export const useFormEditStates = (id: number|string, name = 'post', kind = 'postType') =>
{
	const params = [kind, name, id] as [string, string, number | string];
	
	const { editEntityRecord, saveEditedEntityRecord  } = useDispatch(coreDataStore);
	const { lastError, isExecuting, hasEdits, value, editedValue } =  useSelect(select => {

		const s = select(coreDataStore);

		return ({
			value: s.getEntityRecord(...params),
			editedValue: s.getEditedEntityRecord(...params),
			lastError: s.getLastEntitySaveError(...params),
			isExecuting: s.isSavingEntityRecord(...params),
			hasEdits: s.hasEditsForEntityRecord(...params),
			// editEntityRecord: (edits: any) => editEntityRecord(...params, edits),
			// saveEditedEntityRecord: () => saveEditedEntityRecord(...params, undefined)
		})

	}, [id]);

	const edit = (edits: any) => editEntityRecord(...params, edits);
	const save = async () =>
	{
		if(await saveEditedEntityRecord(...params, undefined))
		{
			return;
		}

		throw new Error(lastError);
	}

	const r: InputFormProps =
	{
		hasEdits,
		lastError,
		isExecuting,
		value: (editedValue as any),
		execute: save,
		cancel: async () => {},
		onValueChanged: edit
	}

	return r;
}

export const useFormDeleteState = (id: number|string, name = 'post', kind = 'postType') =>
{
	const params = [kind, name, id] as [string, string, number|string];

	const { deleteEntityRecord } = useDispatch(coreDataStore);
	const { lastError, isExecuting, post } = useSelect(select => {

		const s = select(coreDataStore);

		return ({
			lastError: s.getLastEntityDeleteError(...params),
			isExecuting: s.isDeletingEntityRecord(...params),
			post: s.getEntityRecord(...params),
		})
	}, [id]);

	const del = async () =>
	{
		// @ts-ignore
		if(await deleteEntityRecord(...params))
		{
			return;
		}

		throw new Error(lastError);
	}

	const r: InputFormProps =
	{
		lastError,
		isExecuting,

		hasEdits: true,
		value: (post as any),

		execute: del,
		cancel: async () => {},
		onValueChanged: (edits) => {}
	}

	return r;
}





export const useLoadEntityState = (name: string, kind: string, query: any) =>
{
	const params = [kind, name, query] as [string, string, any];

	const {items, isLoading} = useSelect(select => {
		const s = select(coreDataStore);

		return ({
			items: s.getEntityRecords(...params),

			// @ts-ignore
			isLoading: !s.hasFinishedResolution('getEntityRecords', params)
		})
	}, [kind, name, query]);


	return { items, isLoading }
}

