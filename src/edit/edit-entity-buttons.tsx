import React from 'react';

import { withAddPostForm, withDeletePostButton, withEditPostForm } from "../base-components/with-entity-components";
import { useInputFormContext } from '../base-components/input-forms';



const AddItemForm = (props) => {

	const { Text } = useInputFormContext();

	return (
		<div>
			<h2>add forms</h2>
			<Text name="title" />
		</div>
	)
};


const RemoveItemForm = ({value}) =>
{
	const { title } = value;

	return (
		<div>
			<h2>{title?.raw}</h2>
			<p>本当に削除しますか？</p>
		</div>
	)
}


const AddEntityForm = withAddPostForm(AddItemForm);
const EditEntityForm = withEditPostForm(AddItemForm);
const DeleteEntityForm = withDeletePostButton(RemoveItemForm);

export { AddEntityForm, EditEntityForm, DeleteEntityForm }
