
import {ShopifyNotFoundError} from "./utils/errors.js"
import {Remote} from "./parts/remote/remote.js"
import {concurrent} from "./utils/concurrent.js"
import {ImageFormat} from "./requests/units/image.js"
import {GqlProduct} from "./requests/units/product.js"
import {paginate} from "./parts/pagination/paginate.js"
import {GqlShop, make_request_for_shop} from "./requests/shop.js"
import {GqlTags, make_request_for_tags} from "./requests/tags.js"
import {make_request_for_single_product} from "./requests/product.js"
import {ShopifySettings} from "./parts/remote/types/shopify_settings.js"
import {PageGenerator} from "./parts/pagination/types/page_generator.js"
import {GqlProducts, make_request_for_products} from "./requests/products.js"
import {default_page_size} from "./parts/remote/defaults/default_page_size.js"
import {GqlCollection, GqlCollections, make_request_for_collections} from "./requests/collections.js"
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

	static async all<N>(generator: PageGenerator<N>) {
		const all: N[] = []

		for await (const [nodes] of generator)
			for (const node of nodes)
				all.push(node)

		return all
	}

	static async first<N>(generator: PageGenerator<N>) {
		const {value} = await generator.next()
		const [nodes] = value!
		return nodes
	}

	async shop(): Promise<GqlShop> {
		return this.remote.request(make_request_for_shop())
	}

	async product({id, image_format = "WEBP"}: {
			id: string
			image_format?: ImageFormat
		}) {

		const {product} = await this.remote.request<{product: GqlProduct}>(
			make_request_for_single_product({id, image_format})
		)

		if (!product)
			throw new ShopifyNotFoundError(`product ${id}`)

		return product
	}

	async *products({
			query,
			image_format = "WEBP",
			page_size = default_page_size,
		}: {
			page_size?: number
			query?: ProductQuerySpec
			image_format?: ImageFormat
		} = {}): PageGenerator<GqlProduct> {

		yield* paginate(
			async({after}) => (await this.remote.request<GqlProducts>(
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
		} = {}): PageGenerator<GqlCollection> {

		yield* paginate(
			async({after}) => (await this.remote.request<GqlCollections>(
				make_request_for_collections({
					after,
					page_size,
					image_format,
				})
			)).collections
		)
	}

	async *tags({
			page_size = default_page_size
		}: {
			page_size?: number
		} = {}): PageGenerator<string> {

		const result = await this.remote
			.request<GqlTags>(make_request_for_tags({page_size}))

		const tags = result.productTags.edges.map(e => e.node)
		const more = false

		yield [tags, more]
	}

	async *products_in_collection({
			collection_id,
			page_size = default_page_size,
			image_format = "WEBP",
		}: {
			collection_id: string
			page_size?: number
			image_format?: ImageFormat
		}): PageGenerator<GqlProduct> {

		yield* paginate(
			async({after}) => (await this.remote.request<GqlProductsInCollection>(
				make_request_for_products_in_collection({
					collection_id,
					after,
					page_size,
					image_format,
				})
			)).collection.products
		)
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

