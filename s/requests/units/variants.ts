
import {gql} from "../../utils/gql.js"

export function variants() {

	// "quantityAvailable" is omitted because it's broken on the storefront api
	//  - https://community.shopify.com/c/hydrogen-headless-and-storefront/need-unauthenticated-read-product-inventory-to-access/td-p/1955913

	return gql`
		variants(first: 250) {
			edges {
				node {

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

				}
			}
		}
	`
}

