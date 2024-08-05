import React from "react"
import { useInputFormContext } from "../../base-components/input-forms";
import { withQueryFormComponent } from "../hoc";

export default withQueryFormComponent((props) =>
{
	const { Object } = useInputFormContext();

	return (
		<Object name="value" />
	)
});
