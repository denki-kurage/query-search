import { ButtonGroup } from "@wordpress/components"
import React from "react"
import { DeleteEntityForm, EditEntityForm } from "./edit-entity-buttons"
import { ModalOpenButton } from "../base-components/buttons-extensions"

export const ListViewCommands = ({kind, name, id}) =>
{
	return (
		<ButtonGroup>
			<ModalOpenButton label="編集">
				<EditEntityForm kind={kind} name={name} id={id} />
			</ModalOpenButton>
			<ModalOpenButton label="削除">
				<DeleteEntityForm kind={kind} id={id} />
			</ModalOpenButton>
		</ButtonGroup>
	)
}
