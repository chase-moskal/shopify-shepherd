
import {Price} from "./price.js"

export type Variant = {
	id: string
	title: string
	availableForSale: boolean
	currentNotInStock: boolean

	price: Price
	compareAtPrice: Price

	image: {
		id: string
	}

	selectedOptions: {
		name: string
		value: string
	}
}

