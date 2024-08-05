import React from "react"
import { useInputFormContext } from "../../base-components/input-forms";
import { withQueryFormComponent } from "../hoc";

export default withQueryFormComponent((props) =>
{
	const { List } = useInputFormContext();

	console.log(props.attributes)

	return (
		<List name="list" />
	)
});
