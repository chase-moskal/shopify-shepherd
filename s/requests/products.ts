
import {gql} from "../utils/gql.js"
import {variants} from "./units/variants.js"
import {ImageFormat, image} from "./units/image.js"
import {GraphRequest} from "./types/graph_request.js"
import {default_page_size} from "../parts/remote/defaults/default_page_size.js"

export function make_request_for_products({
		query,
		after,
		image_format = "WEBP",
		page_size = default_page_size,
	}: {
		query?: string
		after?: string
		page_size?: number
		image_format?: ImageFormat
	}): GraphRequest {

	// "totalInventory" is omitted because it triggers a shopify bug
	//  - https://community.shopify.com/c/hydrogen-headless-and-storefront/need-unauthenticated-read-product-inventory-to-access/td-p/1955913

	return {
		query: gql`
			query FetchProducts($first: Int!, $after: String, $query: String) {
				products(first: $first, after: $after) {
					edges {
						cursor
						node {

							availableForSale
							createdAt
							description
							descriptionHtml
							handle
							id
							isGiftCard
							onlineStoreUrl
							productType
							publishedAt
							requiresSellingPlan
							tags
							title
							updatedAt
							vendor

							options(first: 250) {
								name
								values
							}

							featuredImage {
								id
							}

							collections(first: ${default_page_size}) {
								edges {
									node {
										id
									}
								}
							}

							images(first: ${default_page_size}) {
								edges {
									cursor
									node {
										${image(image_format)}
									}
								}
							}

							${variants()}

						}
					}

					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		`,

		variables: {
			query,
			after,
			first: page_size,
		},
	}
}

