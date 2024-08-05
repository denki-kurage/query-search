import { useDispatch, useSelect } from "@wordpress/data"
import React from "react"
import { store } from "../store"
import { useInputFormContext } from "../base-components/input-forms"
import { InspectorControls } from "@wordpress/block-editor"
import { Button, PanelBody } from "@wordpress/components"


const ResultViewsSelect = ({ resultViews, label }) =>
{
	const { Select } = useInputFormContext();
	
	const options = resultViews.map(rv => ({ label: `${rv.attributes.label}(${rv.attributes.uid})`, value: rv.attributes.uid }));

	return <Select name="pid" label={label} options={options} />
}

export const ResultViewAttachement = ({ pid }) =>
{
	const { selectBlock, toggleBlockHighlight } = useDispatch('core/block-editor');
	const { getAllResultView, getResultView } = useSelect(select => select(store), [pid]);
	const resultViews = getAllResultView();

	
	if(!resultViews.length)
	{
		return <div className="query-form-warning"><p>この投稿に結果ビューが一つもありません。結果ビューを作成してください。</p></div>
	}
	
	const hasPid = !!pid;
	const current = pid ? getResultView(pid) : undefined;

	if(!current)
	{
		const msg = hasPid ? `現在設定されている結果ビュー(${pid})は存在しません。` : '現在特定の結果ビューに属してません。以下の結果ビューを選んでください。';
		return (
			<div className="query-form-warning">
				<p>{msg}</p>
				<ResultViewsSelect label="結果ビューを選択する" resultViews={resultViews} />
			</div>
		)
	}

	const { label, uid, kind, name } = current.attributes;
	const focusResultView = () =>
	{
		const cid = current.clientId;
		selectBlock(cid);
		toggleBlockHighlight(cid, true);
	}

	return (
		<InspectorControls>
			<PanelBody title="結果ビュー">
				<p>label: {label}</p>
				<p>uid: {uid}</p>
				<p>kind: {kind}</p>
				<p>name: {name}</p>
				<ResultViewsSelect label="結果ビューを変更する" resultViews={resultViews} />

				<Button variant="primary" onClick={focusResultView}>
					結果ビューを選択
				</Button>
			</PanelBody>
		</InspectorControls>
	)

}

