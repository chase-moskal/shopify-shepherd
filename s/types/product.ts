
import {Seo} from "./seo.js"
import {Image} from "./image.js"

export type Product = {
	collections: {id: string}[]
	images: Image[]
	seo: Seo

	availableForSale: boolean
	createdAt: string
	description: string
	descriptionHtml: string
	handle: string
	id: string
	isGiftCard: boolean
	onlineStoreUrl?: string
	productType: string
	publishedAt: string
	requiresSellingPlan: boolean
	tags: string[]
	title: string
	totalInventory: number
	updatedAt: string
	vendor: string
}

