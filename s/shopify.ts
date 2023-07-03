
import {Shop} from "./types/shop.js"
import {Product} from "./types/product.js"
import {Remote} from "./parts/remote/remote.js"
import {Collection} from "./types/collection.js"
import {ImageFormat} from "./requests/units/image.js"
import {paginate} from "./parts/pagination/paginate.js"
import {make_request_for_shop} from "./requests/shop.js"
import {make_request_for_products} from "./requests/products.js"
import {make_request_for_collections} from "./requests/collections.js"
import {ShopifySettings} from "./parts/remote/types/shopify_settings.js"
import {default_page_size} from "./parts/remote/defaults/default_page_size.js"
import {ProductQuerySpec, convert_product_query_spec_to_string} from "./parts/queries/convert_product_query_spec_to_string.js"

export class Shopify {
	remote: Remote

	static make(settings: ShopifySettings) {
		return new this(new Remote(settings))
	}

	static async all<T>(generator: AsyncGenerator<T[]>) {
		const all: T[][] = []
		for await (const items of generator)
			all.push(items)
		return all.flat()
	}

	constructor(remote: Remote) {
		this.remote = remote
	}

	async shop(): Promise<Shop> {
		return this.remote.request(make_request_for_shop())
	}

	async *products({
			query,
			image_format = "WEBP",
			page_size = default_page_size,
		}: {
			page_size?: number
			query?: ProductQuerySpec
			image_format?: ImageFormat
		} = {}): AsyncGenerator<Product[]> {

		yield* paginate(
			async({after}) => (await this.remote.request(
				make_request_for_products({
					after,
					page_size,
					image_format,
					query: convert_product_query_spec_to_string(query),
				})
			)).products
		)
	}

	async *collections({
			page_size = default_page_size,
			image_format = "WEBP",
		}: {
			page_size?: number
			image_format?: ImageFormat
		} = {}): AsyncGenerator<Collection[]> {

		yield* paginate(
			async({after}) => (await this.remote.request(
				make_request_for_collections({
					after,
					page_size,
					image_format,
				})
			)).collections
		)
	}

	async fetch_everything_cool() {
		const [shop, products, collections] = await Promise.all([
			this.shop(),
			Shopify.all(this.products()),
			Shopify.all(this.collections()),
		])

		return {
			shop,
			products,
			collections,
		}
	}
}

