import React from "react"
import { useInputFormContext } from "../../base-components/input-forms";
import { useEffect } from "@wordpress/element";
import { withQueryFormComponent } from "../hoc";

export default withQueryFormComponent((props) =>
{
	const { Text } = useInputFormContext();

	return (
		<>
			<Text name="query" />
		</>
	)
});
