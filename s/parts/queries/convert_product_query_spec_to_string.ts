
import {querytext} from "./utils/querytext.js"

export type ProductQuerySpec = {
	collections?: string[]
	tags?: string[]
	terms?: string[]
}

export function convert_product_query_spec_to_string({
		tags = [],
		terms = [],
		collections = [],
	}: ProductQuerySpec = {}): string | undefined {

	const segments: string[] = []

	if (tags.length)
		segments.push(
			tags
				.map(tag => querytext`(tag:'${tag}')`)
				.join(" AND ")
		)

	if (terms.length)
		segments.push(
			terms
				.map(term => querytext`(title:'*${term}*')`)
				.join(" AND ")
		)

	if (collections.length)
		segments.push(
			collections
				.map(id => querytext`(collection_id:'${id})'`)
				.join(" OR ")
		)

	return segments.length
		? segments
			.map(segment => `(${segment})`)
			.join(" AND ")
		: undefined
}

