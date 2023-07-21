
import {gql} from "../utils/gql.js"
import {ImageFormat} from "./units/image.js"
import {GraphRequest} from "./types/graph_request.js"
import {GqlProduct, product} from "./units/product.js"
import {GqlPaginated, paginated} from "./units/paginated.js"
import {default_page_size} from "../parts/remote/defaults/default_page_size.js"

export function make_request_for_products({
		query,
		after,
		image_format = "WEBP",
		page_size = default_page_size,
	}: {
		query?: string
		after?: string
		page_size?: number
		image_format?: ImageFormat
	}): GraphRequest {

	return {
		query: gql`
			query FetchProducts($first: Int!, $after: String, $query: String) {
				products(first: $first, after: $after, query: $query) {
					${paginated(product({image_format}))}
				}
			}
		`,

		variables: {
			query,
			after,
			first: page_size,
		},
	}
}

export type GqlProducts = {
	products: GqlPaginated<GqlProduct>
}

