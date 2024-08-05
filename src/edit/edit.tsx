

import { BlockControls, InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';

import './editor.scss';
import { useMemo, useRef, useState } from '@wordpress/element';
import React from 'react';
import { Button, ButtonGroup, Modal, Panel, PanelBody, TextControl, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import QueryForms from './query-forms';
import { QueryFilters } from './query-filters';
import { ListView } from './list-view';
import { AddEntityForm } from './edit-entity-buttons';
import { InnerBlocksPanel } from '../base-components/form-layout';
import { EditWrapper } from './edit-wrapper';
import { EntityEditor } from './query-entity-editor';
import { ThemeColor } from './theme-color';
import { useInputFormContext } from '../base-components/input-forms';
import { PropertyContextProvider } from '../base-components/input-forms-property-context';
import { useStatePropertiesContextValue } from '../hooks/use-properties-context';
import { ColumnsView } from './columns-view';
import { ModalToolbarButton } from '../base-components/buttons-extensions';
import { EndpointArgsContextProvider, EndpointArgsProvider, useEndpointArgsContext } from './endpoint-context';
import { useAllEndpointArgs } from './hooks';




const HeaderControl = ({kind, name, display, setDisplay}) =>
{
	const hasEntity = kind && name;

	const label = display ? "隠しブロックを非表示にする" : "隠しブロックを表示";

	return (
		<BlockControls>
			<ToolbarGroup>
				{ hasEntity &&
					<ModalToolbarButton label="アイテムの追加" icon="list-view">
						<AddEntityForm kind={kind} name={name} />
					</ModalToolbarButton>
				}
				
				<ToolbarButton icon="list-view" onClick={() => setDisplay(!display)} label={label} />
			</ToolbarGroup>
		</BlockControls>
	)
}


const ResultViewLabelEditor = ({ label, onLabelChanged }) =>
{
	const [ isEdit, setIsEdit ] = useState(false);
	const { Text } = useInputFormContext();
	const pv = useStatePropertiesContextValue({label}) as any;

	const l = isEdit ? "終了する" : "編集する";
	const inputText = pv.properties.label;

	const onChange = () =>
	{
		onLabelChanged(inputText);
		setIsEdit(false);
	}

	return (
		<div className="result-view-label result-view-label-main">
			{label} <Button icon="edit" label={l} onClick={() => setIsEdit(!isEdit)} />
			{ isEdit &&
				<Modal onRequestClose={() => setIsEdit(false)} title="ラベルの編集">
					<PropertyContextProvider value={pv}>
						<Text name="label" />
						<Button disabled={inputText.length === 0} variant="primary" onClick={onChange}>
							ラベルを変更する
						</Button>
					</PropertyContextProvider>
				</Modal>
			}
		</div>
	)
}



export default ({attributes, setAttributes, clientId, isSelected}) =>
{
	
	const blockProps = useBlockProps({className: 'result-view-panel'})

	const { label, uid, kind, name, themeColor, showBlocks } = attributes;

	const ep = useAllEndpointArgs(kind, name);


	const setShowBlocks = ( showBlocks ) =>
	{
		setAttributes({ showBlocks })
	}

	return (
		<EndpointArgsContextProvider value={ep}>
		<div { ...blockProps } style={{ borderColor: themeColor }}>
			<EditWrapper uid={uid} label={label}>


				<ResultViewLabelEditor label={label} onLabelChanged={label => setAttributes({label})}/>

				<HeaderControl
					kind={kind}
					name={name}
					display={showBlocks}
					setDisplay={setShowBlocks} />

				<ListView kind={kind} name={name} uid={uid} />
				
				<div style={{display: showBlocks ? "block" : "none"}}>
					<InnerBlocksPanel label="内部ブロック" themeColor={themeColor}>
						<InnerBlocks />
					</InnerBlocksPanel>
				</div>
				
				<InspectorControls key="searchbar">
					<Panel header="クエリサーチ・パネル">
						<PanelBody title="エンティティ・エディタ">
							<EntityEditor kind={kind} name={name} />
						</PanelBody>
						<PanelBody title="カラム・ビュー">
							<ColumnsView items={[]} />
						</PanelBody>
						<PanelBody title="クエリ・フィルター">
							<QueryFilters kind={kind} name={name} uid={uid} />
						</PanelBody>
						<PanelBody title="クエリ・フォーム">
							<QueryForms kind={kind} name={name} pid={uid} clientId={clientId} />
						</PanelBody>
						<PanelBody title="テーマ・カラー">
							<ThemeColor />
						</PanelBody>
					</Panel>

				</InspectorControls>
			</EditWrapper>
		</div>
		</EndpointArgsContextProvider>
	);
};


const Inspector = () =>
{
	const [txt, setTxt] = useState('');

	return (
		<InspectorControls key="searchbar">
			<PanelBody title="Hello">
				<fieldset>
					<legend>
						text
					</legend>
					<TextControl value={txt} onChange={setTxt} />
				</fieldset>
			</PanelBody>
		</InspectorControls>

	)
	
}









/*
	const contextClientId = useQuerySearchContext();
	const ids = useSelect(s => s(store).getClientIdByContext(contextClientId), []);

	useEffect(() => {
		const bs = select('core/block-editor') as any;
		const { replaceInnerBlocks } = dispatch('core/block-editor') as any;
		const blocks = bs.getClientIdsWithDescendants().map(id => bs.getBlock(id)).filter(b => !!b);
		const clones = blocks.map(b => cloneBlock(b)).filter(b => b.name.indexOf('query-search') === 0 && !ignoreBlockList.includes(b.name));
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ replace")

	console.log(clones);
	replaceInnerBlocks(clientId, clones)

	if(clones.length > 30)
	{
		console.log("ERRRRRRRRRRRRRRRROR")
		return;
	}
			
	}, [ids.join(',')]) as any;
	*/

	