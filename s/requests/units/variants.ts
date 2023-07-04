
import {gql} from "../../utils/gql.js"
import {GqlEdges, edges} from "./edges.js"
import {default_page_size} from "../../parts/remote/defaults/default_page_size.js"

export function variants() {

	// "quantityAvailable" is omitted because it's broken on the storefront api
	//  - https://community.shopify.com/c/hydrogen-headless-and-storefront/need-unauthenticated-read-product-inventory-to-access/td-p/1955913

	return gql`
		variants(first: ${default_page_size}) {
			${edges(gql`

				id
				title
				availableForSale
				currentlyNotInStock

				price {
					amount
					currencyCode
				}

				compareAtPrice {
					amount
					currencyCode
				}

				image {
					id
				}

				selectedOptions {
					name
					value
				}

			`)}
		}
	`
}

export type GqlPrice = {
	amount: string
	currencyCode: string
}

export type GqlVariant = {
	id: string
	title: string
	availableForSale: boolean
	currentlyNotInStock: boolean

	price: GqlPrice
	compareAtPrice: GqlPrice

	image: {
		id: string
	}

	selectedOptions: {
		name: string
		value: string
	}[]
}

export type GqlVariants = {
	variants: GqlEdges<GqlVariant>
}
