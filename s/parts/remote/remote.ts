
import {defaults} from "../shopify/parts/defaults.js"
import {RemoteSettings} from "./types/remote_settings.js"
import {ShopifyResponseError} from "../../utils/errors.js"

export class Remote {
	#settings: RemoteSettings

	constructor(settings: RemoteSettings) {
		this.#settings = settings
	}

	async request<R>({query, variables}: {
			query: string
			variables?: {[key: string]: any}
		}) {

		const {
			domain,
			storefront_access_token,
			api_version = defaults.api_version,
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

		return result.data as R
	}
}

