
import {gql} from "../utils/gql.js"
import {variants} from "./units/variants.js"
import {GqlImage, ImageFormat, image} from "./units/image.js"
import {GraphRequest} from "./types/graph_request.js"
import {GqlPaginated, paginated} from "./units/paginated.js"
import {default_page_size} from "../parts/remote/defaults/default_page_size.js"
import { GqlEdges, edges } from "./units/edges.js"

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
				products(first: $first, after: $after, query: $query) {
					${paginated(gql`

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

						options(first: ${default_page_size}) {
							name
							values
						}

						featuredImage {
							id
						}

						collections(first: ${default_page_size}) {
							${edges(gql`
								id
							`)}
						}

						images(first: ${default_page_size}) {
							${edges(image(image_format))}
						}

						${variants()}

					`)}
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

export type GqlProduct = {
	availableForSale: boolean
	createdAt: string
	description: string
	descriptionHtml: string
	handle: string
	id: string
	isGiftCard: boolean
	onlineStoreUrl: string
	productType: string
	publishedAt: string
	requiresSellingPlan: boolean
	tags: string[]
	title: string
	updatedAt: string
	vendor: string

	options: {
		name: string
		value: string
	}[]

	featuredImage: {
		id: string
	}

	collections: GqlEdges<{
		id: string
	}>

	images: GqlEdges<GqlImage>
}

export type GqlProducts = {
	products: GqlPaginated<GqlProduct>
}

