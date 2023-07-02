
import {gql} from "../utils/gql.js"
import {ImageFormat, image} from "./units/image.js"
import {GraphRequest} from "./types/graph_request.js"
import {default_page_size} from "../parts/remote/defaults/default_page_size.js"

export function make_request_for_collections({
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
			query FetchCollections($first: Int!, $after: String) {
				collections(first: $first, after: $after) {
					edges {
						node {

							description
							descriptionHtml
							handle
							id
							title
							updatedAt
							onlineStoreUrl

							image {
								${image(image_format)}
							}

							seo {
								description
								title
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

