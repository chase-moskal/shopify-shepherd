
import {Remote} from "../remote/remote.js"
import {ImageFormat} from "../graphql/units/image.js"
import {ProductQuerySpec} from "../product_queries/convert_product_query_spec_to_string.js"

export namespace Options {

	export type Shopify = {
		remote: Remote
	}

	export type Product = {
		id: string
		image_format?: ImageFormat
	}

	export type Products = {
		page_size?: number
		query?: ProductQuerySpec
		image_format?: ImageFormat
	}

	export type Collections = {
		page_size?: number
		image_format?: ImageFormat
	}

	export type Tags = {
		page_size?: number
	}

	export type ProductsInCollection = {
		collection_id: string
		page_size?: number
		image_format?: ImageFormat
	}

	export type ProductRecommendations = {
		product_id: string
		image_format?: ImageFormat
		intent?: "RELATED" | "COMPLEMENTARY"
	}
}

