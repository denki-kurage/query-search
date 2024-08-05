import { compose, createHigherOrderComponent } from "@wordpress/compose";
import { usePropertyContext } from "../base-components/input-forms-property-context";
import React from "react";
import { Button, TextControl, } from "@wordpress/components";
import { useBlockProps } from "@wordpress/block-editor";
import { GroupBox } from "../base-components/form-layout";
import { useState } from "@wordpress/element";
import { useUniqueId } from "../hooks/use-unique-id";

export const EditWrapper = ({ uid, label, children }) =>
{
	const getUid = useUniqueId();
	const hasField = !!uid && !!label;
	
	const { properties, setProperty } = usePropertyContext();
	const [title, setTitle] = useState('');

	const setField = () =>
	{
		if(!uid)
		{
			const newUid = getUid();
			setProperty('uid', newUid);
		}

		setProperty('label', title);
	}

	return hasField ? children :
	(
		<GroupBox label="結果ビューのラベル設定">
			<TextControl value={title} onChange={setTitle} label="ラベル" />
			<Button variant="primary" onClick={setField}>
				ラベルの設定後、インスペクターから種類と名前を選んでください。
			</Button>
		</GroupBox>
	)
}

export default EditWrapper;