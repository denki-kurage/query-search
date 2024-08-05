import React from "react"
import { useInputFormContext } from "../../base-components/components"
import { withFieldInput } from "../../base-components/withFieldInput";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";


export default withFieldInput((props) =>
{
	const attributes = props.attributes;
	const { kind, name } = attributes;
	const { Select } = useInputFormContext();

	// @ts-ignore
	const configs = useSelect(s => s('core').getEntitiesConfig(kind));

	const kindOptions = ['postType', 'taxonomy', 'root'].map(x => ({label: x, value: x}))
	const postTypeOptions = configs.map(c => ({label: `${c.label}(${c.name})`, value: c.name}));
	

	// チェックボックスIDsに変更があった時クエリを通知
	useEffect(() => {
		
	}, [name]);

	return (
		<>
			<Select name="kind" options={kindOptions} />
			<Select name="name" options={postTypeOptions} />
		</>
	)
});
