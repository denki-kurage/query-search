import React from "react"
import { useInputFormContext } from "../../base-components/input-forms";
import { withQueryFormComponent } from "../hoc";

export default withQueryFormComponent((props) =>
{
	const { Boolean } = useInputFormContext();

	return (
		<Boolean name="query" />
	)
});
