
import {Remote} from "./remote/remote.js"
import {Options} from "./parts/options.js"
import {defaults} from "./parts/defaults.js"
import {concurrent} from "../tools/concurrent.js"
import {GqlProduct} from "./graphql/units/product.js"
import {ShopifyNotFoundError} from "./parts/errors.js"
import {all} from "./graphql/pagination/helpers/all.js"
import {paginate} from "./graphql/pagination/paginate.js"
import {first} from "./graphql/pagination/helpers/first.js"
import {GqlShop, make_request_for_shop} from "./graphql/shop.js"
import {GqlTags, make_request_for_tags} from "./graphql/tags.js"
import {ShopifySettings} from "./remote/types/shopify_settings.js"
import {make_request_for_single_product} from "./graphql/product.js"
import {PageGenerator} from "./graphql/pagination/types/page_generator.js"
import {GqlProducts, make_request_for_products} from "./graphql/products.js"
import {make_request_for_specific_products} from "./graphql/specific_products.js"
import {GqlCollection, GqlCollections, make_request_for_collections} from "./graphql/collections.js"
import {convert_product_query_spec_to_string} from "./product_queries/convert_product_query_spec_to_string.js"
import {GqlProductsInCollection, make_request_for_products_in_collection} from "./graphql/products_in_collection.js"
import {GqlProductRecommendations, make_request_for_product_recommendations} from "./graphql/product_recommendations.js"

export class Shopify {
	static all = all
	static first = first
	static setup(settings: ShopifySettings) {
		return new this({remote: new Remote(settings)})
	}

	remote: Remote

	constructor(o: Options.Shopify) {
		this.remote = o.remote
	}

	async shop(): Promise<GqlShop> {
		return this.remote.request(make_request_for_shop())
	}

	async product(o: Options.Product) {
		const {product} = await this.remote.request<{product: GqlProduct}>(
			make_request_for_single_product({
				id: o.id,
				image_format: o.image_format ?? defaults.image_format,
			})
		)
		if (!product)
			throw new ShopifyNotFoundError(`product ${o.id}`)
		return product
	}

	async *products(o: Options.Products = {}): PageGenerator<GqlProduct> {
		yield* paginate(
			async after => (await this.remote.request<GqlProducts>(
				make_request_for_products({
					after,
					page_size: o.page_size ?? defaults.page_size,
					image_format: o.image_format ?? defaults.image_format,
					query: convert_product_query_spec_to_string(o.query),
				})
			)).products
		)
	}

	async *collections(
			o: Options.Collections = {}
		): PageGenerator<GqlCollection> {
		yield* paginate(
			async after => (await this.remote.request<GqlCollections>(
				make_request_for_collections({
					after,
					page_size: o.page_size ?? defaults.page_size,
					image_format: o.image_format ?? defaults.image_format,
				})
			)).collections
		)
	}

	async *tags(o: Options.Tags = {}): PageGenerator<string> {
		const result = await this.remote.request<GqlTags>(
			make_request_for_tags({page_size: o.page_size ?? defaults.page_size})
		)
		const tags = result.productTags.edges.map(e => e.node)
		const more = false
		yield [tags, more]
	}

	async *products_in_collection(
			o: Options.ProductsInCollection
		): PageGenerator<GqlProduct> {
		yield* paginate(
			async after => (await this.remote.request<GqlProductsInCollection>(
				make_request_for_products_in_collection({
					after,
					collection_id: o.collection_id,
					page_size: o.page_size ?? defaults.page_size,
					image_format: o.image_format ?? defaults.image_format,
				})
			)).collection?.products
		)
	}

	async product_recommendations(o: Options.ProductRecommendations) {
		return (await this.remote.request<GqlProductRecommendations>(
			make_request_for_product_recommendations({
				intent: o.intent,
				product_id: o.product_id,
				image_format: o.image_format ?? defaults.image_format,
			})
		)).productRecommendations
	}

	async specific_products(o: Options.SpecificProducts) {
		const {products} = await this.remote.request<{products: GqlProduct[]}>(
			make_request_for_specific_products({
				ids: o.ids,
				image_format: o.image_format ?? defaults.image_format,
			})
		)
		return products
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

