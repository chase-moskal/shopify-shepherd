
import {Product} from "./types/product.js"
import {Remote} from "./parts/remote/remote.js"
import {Collection} from "./types/collection.js"
import {ImageFormat} from "./requests/units/image.js"
import {paginate} from "./parts/pagination/paginate.js"
import {make_request_for_shop} from "./requests/shop.js"
import {make_request_for_products} from "./requests/products.js"
import {CountryLibrary} from "./parts/countries/country_library.js"
import {make_request_for_collections} from "./requests/collections.js"
import {ShopifySettings} from "./parts/remote/types/shopify_settings.js"
import {default_page_size} from "./parts/remote/defaults/default_page_size.js"

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

	async info() {
		const result = await this.remote.request(make_request_for_shop())
		return result.shop as {
			name: string
			description?: string
			shipsToCountries: string[]
			paymentSettings: {
				currencyCode: string
				countryCode: string
			}
		}
	}

	async *products({
			page_size = default_page_size,
			image_format = "WEBP",
		}: {
			page_size?: number
			image_format?: ImageFormat
		} = {}): AsyncGenerator<Product[]> {

		yield* paginate(
			async({after}) => (await this.remote.request(
				make_request_for_products({
					after,
					page_size,
					image_format,
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
		const [info, products, collections] = await Promise.all([
			this.info(),
			Shopify.all(this.products()),
			Shopify.all(this.collections()),
		])

		const country_library = new CountryLibrary()
		const countries_with_available_shipping = country_library.query(info.shipsToCountries)

		return {
			info,
			products,
			collections,
			countries_with_available_shipping,
		}
	}
}

