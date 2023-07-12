
import {Fetcher} from "./types/fetcher.js"

export async function *paginate<N>(fetch: Fetcher<N>) {
	let after: string | undefined
	let fetch_count = 0
	const there_are_more_pages = () => !!((fetch_count === 0) || after)

	while (there_are_more_pages()) {
		fetch_count += 1
		const result = await fetch({after})
		const {edges, pageInfo: {hasNextPage, endCursor}} = result
		after = hasNextPage ?endCursor :undefined
		const products = edges.map(edge => edge.node)

		if (there_are_more_pages())
			yield products
		else
			return products
	}
}

