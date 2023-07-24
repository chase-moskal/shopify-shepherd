
import {gql} from "../utils/gql.js"
import {ImageFormat} from "./units/image.js"
import {GraphRequest} from "./types/graph_request.js"
import {GqlProduct, product} from "./units/product.js"
import {GqlPaginated, paginated} from "./units/paginated.js"

export function make_request_for_products_in_collection({
		after,
		page_size,
		image_format,
		collection_id,
	}: {
		after: string | undefined
		page_size: number
		collection_id: string
		image_format: ImageFormat
	}): GraphRequest {
	return {

		query: gql`
			query FetchProductsInCollection($first: Int!, $collection_id: ID!, $after: String) {
				collection(id: $collection_id) {
					products(first: $first, filters: {available: true}, after: $after) {
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

