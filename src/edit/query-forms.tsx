import { select, useDispatch, useRegistry, useSelect } from '@wordpress/data';
import React from 'react';
import { store } from '../store';
import { Button, withFilters } from '@wordpress/components';


import { useState, useMemo } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { BlockEdit, store as blockEditorStore } from '@wordpress/block-editor';
import { useInputFormContext } from "../base-components/input-forms";
import { generateUniqueId } from '../store/selectors';
import QueryFormHost from '../blocks/query-form-host';
import { useQueryFormTitle } from '../blocks/hooks';
import { PropertyContextProvider } from '../base-components/input-forms-property-context';
import { useStatePropertiesContextValue } from '../hooks/use-properties-context';
import { filters } from '@wordpress/hooks';
import { useEndpointArgsContext } from './endpoint-context';

const AddSelect = ({options, onChanged, label}) => {
	const { Select } = useInputFormContext();
	const pv = useStatePropertiesContextValue();

	return (
		<PropertyContextProvider value={pv}>
			<Select name="value" label={label} options={options} onChanged={(k, v) => onChanged(v)} />
		</PropertyContextProvider>
	);
};


const EndpointSelect = ({ kind, name, label, onChanged }) =>
{
	const { Select } = useInputFormContext();
	const pv = useStatePropertiesContextValue();
	const { options, args } = useEndpointArgsContext() ?? {};


	return (
		<PropertyContextProvider value={pv}>
			<Select name="value" label={label} options={options} onChanged={(k, v) => onChanged(v)} />
		</PropertyContextProvider>
	)
	return (
		<div>
			{ Object.entries(args).map(([key, arg]) => <EndpointForm arg={arg} field={key} key={key} />)}
		</div>
	)

}

export default ({pid, clientId, kind, name}) =>
{
	const [ queryFormName, setQueryFormName ] = useState('');
	const [ endpointField, setEndpointField ] = useState('');

	const { insertBlock } = useDispatch('core/block-editor');

	const { blockNames, blocks } = useSelect(s => {
		const { getQueryFormNames, getQueryFormsByResultView } = s(store);
		return ({
			blockNames: getQueryFormNames(),
			blocks: getQueryFormsByResultView(pid),
		})
	}, []);

	const types = blockNames
		.map(bn => select('core/blocks').getBlockType(bn))
		.map(b => ({ label: b.title, value: b.name, description: b.description }));
	

	const addQueryForm = () =>
	{
		if(blockNames.includes(queryFormName))
		{
			const block = createBlock(
				queryFormName,
				{
					pid,
					uid: generateUniqueId()
				}
			)
			insertBlock(block, 0, clientId, false);
		}
	}

	const addQueryFormFromEndpoint = () =>
	{

	}

	return (
		<div>
			<div className="query-form-additional">
				<AddSelect label="クエリフォームを追加" options={types} onChanged={setQueryFormName} />
				{
					queryFormName &&
					<Button variant="primary" onClick={addQueryForm}>追加する</Button>
				}
			</div>
			<div className="query-form-additional query-form-endpoint">
				<EndpointSelect label="エンドポイントから追加" kind={kind} name={name} onChanged={setEndpointField} />
				{
					endpointField &&
					<Button variant="primary" onClick={addQueryFormFromEndpoint}>追加する</Button>
				}
			</div>
			<div>

				{ blocks.map(block => 
					<InputForm
						key={block.attributes.uid}
						name={block.name}
						clientId={block.clientId} />
				) }
			</div>
		</div>
	)
}


const InputForm = ({name, clientId}) =>
{
	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	const { attributes } = useSelect(s => {
		// @ts-ignore
		return s(blockEditorStore).getBlock(clientId);
	}, [])

	const setAttributes = useMemo(() => newAttributes => {
		updateBlockAttributes(clientId, newAttributes)
	}, [clientId]);

	const fm = useQueryFormTitle(name, attributes.field);

	return (
		<QueryFormHost name={name} attributes={attributes} setAttributes={setAttributes} />
	);
}

const EndpointForm = ({ arg, field }) =>
{


	return (
		<>
		</>
	)
}


