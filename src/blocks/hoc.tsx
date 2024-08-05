import { BlockEdit, store as blockEditorStore, InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { compose, createHigherOrderComponent } from "@wordpress/compose";
import React from "react";
import { PropertyContextProvider, usePropertyContext } from "../base-components/input-forms-property-context";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { Button, PanelBody, TextControl } from "@wordpress/components";
import { select, useDispatch, useSelect } from "@wordpress/data";
import { getBlockType } from "@wordpress/blocks";
import { GroupBox } from "../base-components/form-layout";
import { ResultViewAttachement } from "./result-view-attachement";
import { useQueryFormTitle } from "./hooks";
import { store } from "../store";
import { createInputFormComponents, useInputFormContext } from "../base-components/input-forms";
import { useUniqueId } from "../hooks/use-unique-id";
import { useAttributePropertiesContextValue, useStatePropertiesContextValue } from "../hooks/use-properties-context";




const useCurrentResultView = pid =>
{
	return useSelect(s => s(store).getResultView(pid), [pid]);
}

// ResultViewはブロック上存在していてもuidが無い場合は無効とする
const useResultViewsWithUID = () =>
{
	return useSelect(s => s(store).getAllResultView().filter(rv => !!rv.attributes.uid), []);
}


const ResultViewLabel = ({ themeColor, label}) =>
{
	const style = themeColor ? { borderColor: themeColor, color: themeColor } : {};

	return (
		<div className="result-view-label" style={style}>
			■結果ビュー： {label}
		</div>
	)
}
const withFieldInputComponent = createHigherOrderComponent(BlockEdit => props => {
	const { attributes = {}, name, clientId, isBlock = false } = props;
	const { field, uid, pid } = attributes;
	const getUid = useUniqueId();

	const currentResultView = useCurrentResultView(pid);
	const { parentResultView } = useSelect(select => {
		const s = select(store);
		return ({
			parentResultView: s.getParentResultView(clientId)
		})
	}, [clientId]);

	const { setProperty } = usePropertyContext();

	const [fieldName, setFieldName] = useState('');
	const hasField = !!field;


	const fm = useQueryFormTitle(name, field);

	const setField = () =>
	{
		setProperty('field', fieldName);
		if(!uid)
		{
			const parentUID = parentResultView?.uid ?? '';

			const newUid = getUid() + "-uid";
			setProperty('uid', newUid)
			setProperty('pid', parentUID)
		}
	}
	
	return (
		<GroupBox label={fm}>

			{ isBlock && <ResultViewLabel themeColor={currentResultView?.attributes?.themeColor} label={currentResultView?.attributes?.label} /> }
		
			{ hasField ? <BlockEdit {...props} /> 
			:
			(
				<>
					<h2>クエリ名を入力してください・</h2>

					<TextControl
						label="fieldName"
						value={fieldName}
						onChange={setFieldName} />
					<Button
						disabled={fieldName.length === 0}
						variant="primary"
						onClick={setField}>
							フィールド名({fieldName})を決定
					</Button>
				</>
			)
		}
		</GroupBox>	
	)

}, 'withFieldInputComponent');




const ResultViewsSelect = ({ resultViews, label }) =>
{
	const { Select } = useInputFormContext();

	const options = useMemo(
		() => resultViews.map(rv => ({ label: `${rv.attributes.label}(${rv.attributes.uid})`, value: rv.attributes.uid })), [resultViews.map(rv => rv.uid).join(',')])


	return <Select name="pid" label={label} options={options} />
}

const withResultViewAttachement = createHigherOrderComponent(BlockEdit => props => {

	const { attributes } = props;
	const { pid } = attributes;

	const resultViews = useResultViewsWithUID();
	const currentResultView = useCurrentResultView(pid);
	
	const hasPid = !!pid;

	if(!resultViews.length)
	{
		return (
			<>
				<div className="query-form-warning">
					<p>この投稿に結果ビューが一つもありません。結果ビューを作成してください。</p>
				</div>
				<BlockEdit {...props} />
			</>
		)
	}


	if(!currentResultView)
	{
		const msg = hasPid ? `現在設定されている結果ビュー(${pid})は存在しません。` : '現在特定の結果ビューに属してません。以下の結果ビューを選んでください。';

		return (
			<>
				<div className="query-form-warning">
					<p>{msg}</p>
					<ResultViewsSelect label="結果ビューを選択する" resultViews={resultViews} />
				</div>
				<BlockEdit {...props} />
			</>
		)		
	}

	return <BlockEdit {...props} />

}, 'withResultViewAttachement')



export const withQueryFormBlock = createHigherOrderComponent(BlockEdit => (props) => {
	
	const { clientId, attributes, setAttributes } = props;
	const { uid, field, query, pid } = attributes;
	const { Text } = useInputFormContext();

	const usPv = useStatePropertiesContextValue({field}) as any;
	const fieldValue = usPv.properties?.field ?? '';


	
	const parentResultView = useSelect(s => s(store).getParentResultView(clientId), [clientId]);

	const currentResultView = useCurrentResultView(pid);
	const resultViews = useResultViewsWithUID();

	console.log(parentResultView === currentResultView);
	
	const { selectBlock, toggleBlockHighlight, moveBlockToPosition } = useDispatch(blockEditorStore);
	const blockProps = useBlockProps();

	const { label, kind, name } = currentResultView?.attributes ?? {};


	const canMoveToHiddenBlocks = currentResultView && (parentResultView !== currentResultView);

	const moveToHiddenBlocks = () =>
	{
		if(canMoveToHiddenBlocks)
		{
			const fromId = parentResultView?.clientId;
			const movetoId = currentResultView.clientId;
			moveBlockToPosition(
				clientId,
				fromId,
				movetoId,
				0
			);

		}
	}

	const focusResultView = () =>
	{
		if(currentResultView)
		{
			const cid = currentResultView.clientId;
			selectBlock(cid);
			toggleBlockHighlight(cid, true);
		}
	}


	return (
		<div {...blockProps}>

			<BlockEdit {...props} isBlock={true} />

			<InspectorControls>
				<PanelBody title="情報">
					<p>ID: {uid}</p>
					<p>field: {field}</p>
					<p>query: {query}</p>

					<PropertyContextProvider value={usPv}>
						<Text name="field" />
						<Button variant="primary" disabled={field === fieldValue || fieldValue.length === 0} onClick={() => setAttributes({field: usPv.properties?.field})}>
							上書する
						</Button>
					</PropertyContextProvider>

					<Button variant="primary" onClick={moveToHiddenBlocks} disabled={!canMoveToHiddenBlocks}>
						隠しブロックへ移動
					</Button>
					
				</PanelBody>
				<PanelBody title="結果ビュー">
					<p>ID: {pid}</p>
					<p>label: {label}</p>
					<p>kind: {kind}</p>
					<p>name: {name}</p>
					<ResultViewsSelect label="結果ビューを変更する" resultViews={resultViews} />

					<Button variant="primary" onClick={focusResultView}>
						結果ビューを選択
					</Button>

				</PanelBody>
			</InspectorControls>
		</div>
	)
	

}, 'withQueryFormBlock');



export const withQueryFormComponent = compose(withFieldInputComponent, withResultViewAttachement);
