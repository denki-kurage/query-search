import React from "react"
import { useBlockProps, store as blockEditorStore, BlockEdit, InnerBlocks, BlockList } from "@wordpress/block-editor";

import { useDispatch, useSelect } from '@wordpress/data';
import { store } from "../store";
import { Button, CheckboxControl, Modal, RadioControl, TextareaControl, ToggleControl } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import { blocksToGroupByField, getQueries } from "./hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { usePropertyContext } from "../base-components/input-forms-property-context";



export const QueryFilters = ({kind, name, uid}) =>
{
	const { properties, setProperty } = usePropertyContext();
	const { minimum } = properties;
	const { blocks, queryString } = getQueries(kind, name, uid);


	return (
		<div className="query-filters">

			<ToggleControl label="省スペース表示を有効にする" checked={minimum} onChange={b => setProperty('minimum', b)} />
			
			
			<ButtonOrModal expanded={!minimum}>
				<TextareaControl value={queryString} onChange={e => {}} />
				<QueryItems blocks={blocks} />
			</ButtonOrModal>

		</div>
	)
}

const ButtonOrModal = ({children, expanded}) =>
{
	if(expanded)
	{
		return children;
	}
	else
	{
		return <ModalOpen>{ children }</ModalOpen>
	}
}

const ModalOpen = ({children}) =>
{
	const [open, setOpen] = useState(false);

	if(open)
	{
		return (
			<Modal title="クエリ・リスト" onRequestClose={() => setOpen(false)}>
				{ children }
			</Modal>
		)
	}

	return (
		<Button variant="primary" onClick={() => setOpen(true)}>
			クエリ・リストを開く
		</Button>
	)
}

const QueryItems = ({blocks}) =>
{
	const [hoverQuery, setHoverQuery] = useState('');

	// @ts-ignore
	const hoverBlockAttributes = useSelect(s => s('core/block-editor').getBlockAttributes(hoverQuery), []);

	const map = blocksToGroupByField(blocks) as any;

	return (
		<>
		{
			map.entries(([field, items]) => <h2>{field}</h2>)
		}
			{
				(Object.entries(map) as any).map(([field, items]) => {
					return items.length === 1 ?
					<CheckItem key={field} field={field} block={items[0]}  /> :
					<CheckItems key={field} field={field} blocks={items} />;
				})
			}
			
			<p>{hoverBlockAttributes?.query ?? ' '}</p>
		</>
	)
}

const CheckItems = ({field, blocks, }) =>
{
	const options = blocks.map(block => ({ label: block.attributes?.query, value: block.attributes?.uid }));
	const { updateBlockAttributes } = useDispatch('core/block-editor');
	const [ selected, setSelected ] = useState(blocks.find(b => b.attributes?.enabled)?.attributes?.uid);

	
	const clear = () =>
	{
		const clientIds = blocks.map(item => item.clientId);
		updateBlockAttributes(clientIds, { enabled: false });
		setSelected(undefined);
	}

	const change = u =>
	{
		const clientIds = blocks.map(item => item.clientId);
		const block = blocks.find(item => item.attributes?.uid === u);
		const cid = block?.clientId;
		updateBlockAttributes(clientIds, { enabled: false});
		updateBlockAttributes(cid, {enabled: true});
		setSelected(u);
	}
	
	return (
		<div className="query-form-select query-form-select-radio">
			<RadioControl
				label={field}
				selected={selected}
				onChange={change}
				options={options}
				/>
			<Button style={{width: '100%'}} disabled={!selected} variant="secondary" onClick={clear}>
				クリア
			</Button>
		</div>
	);
}

const CheckItem = ({field, block, }) =>
{
	const { attributes, clientId } = block;
	const { enabled, query } = attributes;
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const change = c =>
	{
		updateBlockAttributes(clientId, { enabled: !enabled });
	}
	

	return (
		<div className="query-form-select query-form-select-check">
			<CheckboxControl
				style={{width: '100%'}}
				checked={enabled}
				onChange={change}
				label={`${field}: ${query}`}
				__nextHasNoMarginBottom={true}
				/>
		</div>
	)
}



const withHoverComponents = createHigherOrderComponent(BlockEdit => (props) =>
{
	const { uid } = props;
	const [ hover, setHover ] = useState(null);

	const { toggleBlockHighlight, selectBlock  } = useDispatch(blockEditorStore);

	// @ts-ignore
	const block = useSelect(s => s(store).getQueryFormByUid(uid), [uid]);

	if(!block)
	{
		return <BlockEdit {...props} />
	}

	const { clientId } = block;



	const mouseEnter = () =>
	{
		setHover(uid);
	}
	const mouseLeave = () =>
	{
		setHover(null);
	}

	const select = () =>
	{
		selectBlock(clientId);
	}

	useEffect(() => {
		if(hover)
		{
			toggleBlockHighlight(hover, true);
		}
	}, [hover])

	return (
		<div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
			<BlockEdit {...props} />
		</div>
	)
}, 'withHoverComponents');


