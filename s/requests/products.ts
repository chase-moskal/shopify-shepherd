
import {gql} from "../utils/gql.js"
import {ImageFormat, image} from "./units/image.js"
import {GraphRequest} from "./types/graph_request.js"
import {default_page_size} from "../parts/remote/defaults/default_page_size.js"

export function make_request_for_products({
		after,
		image_format = "WEBP",
		page_size = default_page_size,
	}: {
		after?: string
		page_size?: number
		image_format?: ImageFormat
	}): GraphRequest {

	return {
		query: gql`
			query FetchProducts($first: Int!, $after: String) {
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
							totalInventory
							updatedAt
							vendor

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
			after,
			first: page_size,
		},
	}
}

