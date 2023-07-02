
import {Fetcher} from "./types/fetcher.js"
import {GqlEdge} from "./types/gql_edge.js"

export function unwrap<N = any>({edges}: {edges: GqlEdge<N>[]}) {
	return edges.map(e => e.node)
}

export async function *paginate<R = any>(fetch: Fetcher<R>) {
	let after: string | undefined
	let fetch_count = 0
	const there_are_more_pages = () => ((fetch_count === 0) || after)

	while (there_are_more_pages()) {
		fetch_count += 1
		const result = await fetch({after})
		const {pageInfo: {hasNextPage, endCursor}} = result
		after = hasNextPage ?endCursor :undefined
		yield unwrap(result)
	}
}

paginate.unwrap = unwrap

