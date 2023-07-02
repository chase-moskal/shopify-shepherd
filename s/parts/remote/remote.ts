
import {ShopifyResponseError} from "../../utils/errors.js"
import {ShopifySettings} from "./types/shopify_settings.js"
import {default_api_version} from "./defaults/default_api_version.js"

export class Remote {
	#settings: ShopifySettings

	constructor(settings: ShopifySettings) {
		this.#settings = settings
	}

	async request({query, variables}: {
			query: string
			variables?: {[key: string]: any}
		}) {

		const {
			domain,
			storefront_access_token,
			api_version = default_api_version,
		} = this.#settings

		const url = `https://${domain}/api/${api_version}/graphql`
		const method = "POST"

		const headers = {
			"Content-Type": "application/json",
			"X-Sdk-Variant": "javascript",
			"X-Sdk-Version": "2.19.0",
			"X-Shopify-Storefront-Access-Token": storefront_access_token,
		}

		const request = variables
			? {query, variables}
			: {query}

		const response = await fetch(url, {
			method,
			headers,
			mode: "cors",
			body: JSON.stringify(request),
		})

		const result = await response.json()

		if ("errors" in result)
			for (const error of result.errors)
				throw new ShopifyResponseError(error)

		return result.data
	}
}

