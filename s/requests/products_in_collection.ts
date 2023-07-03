
import {gql} from "../utils/gql.js"
import {ImageFormat} from "./units/image.js"
import {GraphRequest} from "./types/graph_request.js"
import {GqlProduct, product} from "./units/product.js"
import {GqlPaginated, paginated} from "./units/paginated.js"
import {default_page_size} from "../parts/remote/defaults/default_page_size.js"

export function make_request_for_products_in_collection({
		collection_id,
		after,
		image_format = "WEBP",
		page_size = default_page_size,
	}: {
		collection_id: string
		after?: string
		page_size?: number
		image_format?: ImageFormat
	}): GraphRequest {

	return {
		query: gql`
			query FetchProductsInCollection($first: Int!, $collection_id: String!, $after: String) {
				collection(id: $collection_id) {
					products(first: $first, filters: {available: true}) {
						${paginated(product({image_format}))}
					}
				}
			}
		`,

		variables: {
			collection_id,
			after,
			first: page_size,
		},
	}
}

export type GqlProductsInCollection = {
	collection: {
		products: GqlPaginated<GqlProduct>
	}
}

