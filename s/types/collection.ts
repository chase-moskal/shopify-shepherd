
import {Seo} from "./seo.js"
import {Image} from "./image.js"

export type Collection = {
	image: Image
	seo: Seo

	description: string
	descriptionHtml: string
	handle: string
	id: string
	title: string
	updatedAt: string
	onlineStoreUrl: string
}

