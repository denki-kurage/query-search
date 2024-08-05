import React from "react"
import { useInputFormContext } from "../../base-components/input-forms";
import { withQueryFormComponent } from "../hoc";

export default withQueryFormComponent((props) =>
{
	const { DateTime } = useInputFormContext();

	return (
		<>
			<DateTime name="query" />
		</>
	)
});
