
import {Remote} from "./parts/remote/remote.js"
import {concurrent} from "./utils/concurrent.js"
import {ImageFormat} from "./requests/units/image.js"
import {GqlProduct} from "./requests/units/product.js"
import {paginate} from "./parts/pagination/paginate.js"
import {GqlShop, make_request_for_shop} from "./requests/shop.js"
import {GqlTags, make_request_for_tags} from "./requests/tags.js"
import {make_request_for_single_product} from "./requests/product.js"
import {delegate_async_generator} from "./utils/delegate_generator.js"
import {ShopifySettings} from "./parts/remote/types/shopify_settings.js"
import {GqlProducts, make_request_for_products} from "./requests/products.js"
import {default_page_size} from "./parts/remote/defaults/default_page_size.js"
import {GqlCollections, make_request_for_collections} from "./requests/collections.js"
import {GqlProductsInCollection, make_request_for_products_in_collection} from "./requests/products_in_collection.js"
import {GqlProductRecommendations, make_request_for_product_recommendations} from "./requests/product_recommendations.js"
import {ProductQuerySpec, convert_product_query_spec_to_string} from "./parts/queries/convert_product_query_spec_to_string.js"

export class Shopify {
	remote: Remote

	constructor(remote: Remote) {
		this.remote = remote
	}

	static setup(settings: ShopifySettings) {
		return new this(new Remote(settings))
	}

	static async all<Y>(generator: AsyncGenerator<Y[]>) {
		const all: Y[][] = []

		for await (const items of generator)
			all.push(items)

		return all.flat()
	}

	async shop(): Promise<GqlShop> {
		return this.remote.request(make_request_for_shop())
	}

	async product({id, image_format = "WEBP"}: {
			id: string
			image_format?: ImageFormat
		}) {
		return this.remote.request<GqlProduct>(
			make_request_for_single_product({id, image_format})
		)
	}

	products({
			query,
			image_format = "WEBP",
			page_size = default_page_size,
		}: {
			page_size?: number
			query?: ProductQuerySpec
			image_format?: ImageFormat
		} = {}) {

		return delegate_async_generator(paginate(
			async({after}) => (await this.remote.request<GqlProducts>(
				make_request_for_products({
					after,
					page_size,
					image_format,
					query: convert_product_query_spec_to_string(query),
				})
			)).products
		))
	}

	collections({
			page_size = default_page_size,
			image_format = "WEBP",
		}: {
			page_size?: number
			image_format?: ImageFormat
		} = {}) {

		return delegate_async_generator(paginate(
			async({after}) => (await this.remote.request<GqlCollections>(
				make_request_for_collections({
					after,
					page_size,
					image_format,
				})
			)).collections
		))
	}

	async *tags({
			page_size = default_page_size
		}: {
			page_size?: number
		} = {}): AsyncGenerator<string[]> {

		const result = await this.remote.request<GqlTags>(
			make_request_for_tags({page_size})
		)

		return result.productTags.edges.map(e => e.node)
	}

	products_in_collection({
			collection_id,
			page_size = default_page_size,
			image_format = "WEBP",
		}: {
			collection_id: string
			page_size?: number
			image_format?: ImageFormat
		}) {

		return delegate_async_generator(paginate(
			async({after}) => (await this.remote.request<GqlProductsInCollection>(
				make_request_for_products_in_collection({
					collection_id,
					after,
					page_size,
					image_format,
				})
			)).collection.products
		))
	}

	async product_recommendations({
			intent,
			product_id,
			image_format = "WEBP",
		}: {
			product_id: string
			image_format?: ImageFormat
			intent?: "RELATED" | "COMPLEMENTARY"
		}) {

		return (await this.remote.request<GqlProductRecommendations>(
			make_request_for_product_recommendations({
				intent,
				product_id,
				image_format,
			})
		)).productRecommendations
	}

	async everything() {
		return concurrent({
			shop: this.shop(),
			tags: Shopify.all(this.tags()),
			products: Shopify.all(this.products()),
			collections: Shopify.all(this.collections()),
		})
	}
}

