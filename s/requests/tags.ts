
import {gql} from "../utils/gql.js"
import {GraphRequest} from "./types/graph_request.js"
import {GqlPaginated, paginated_node} from "./units/paginated.js"
import {default_page_size} from "../parts/remote/defaults/default_page_size.js"

export function make_request_for_tags({
		page_size = default_page_size,
	}: {
		page_size?: number
	}): GraphRequest {
	return {

		query: gql`
			query FetchTags($first: Int!) {
				productTags(first: $first) {
					${paginated_node()}
				}
			}
		`,

		variables: {
			first: page_size,
		},
	}
}

export type GqlTag = string

export type GqlTags = {
	productTags: GqlPaginated<GqlTag>
}

