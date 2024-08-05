import { getBlockType } from "@wordpress/blocks";

export const useQueryFormTitle = (name, field) =>
{
	const blockTitle = getBlockType(name)?.title ?? '???';
	return `${field} (${blockTitle})`;
}
