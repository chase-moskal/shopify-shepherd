
import {gql} from "../../utils/gql.js"

export function variants() {

	// "quantityAvailable" is omitted because it's broken on the storefront api
	//  - https://community.shopify.com/c/hydrogen-headless-and-storefront/need-unauthenticated-read-product-inventory-to-access/td-p/1955913

	return gql`
		variants(first: 250) {
			edges {
				node {

					id
					availableForSale
					barcode
					currentlyNotInStock
					id
					title

					image {
						id
					}

					compareAtPrice {
						currencyCode
						amount
					}

					price {
						amount
						currencyCode
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

