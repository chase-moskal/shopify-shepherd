
import {gql} from "../../tools/gql.js"
import {GraphRequest} from "./types/graph_request.js"

export type CheckoutLineItem = {
	variant_id: string
	quantity: number
}

export function make_request_for_checkout_create({
		line_items,
	}: {
		line_items: CheckoutLineItem[]
	}): GraphRequest {

	return {
		query: gql`
			mutation CreateCheckout($input: CheckoutCreateInput!) {
				checkoutCreate(input: $input) {
					checkout {
						id
						webUrl
					}
				}
			}
		`,

		variables: {
			input: {
				lineItems: line_items.map(i => ({
					variantId: i.variant_id,
					quantity: i.quantity
				}))
			},
		},
	}
}

export type GqlCheckout = {
	id: string
	webUrl: string
	// lineItems: {
	// 	edges: {
	// 		node: {
	// 			id: string
	// 			title: string
	// 			variant: {
	// 				id: string
	// 				price: string
	// 				title: string
	// 			}
	// 			quantity: number
	// 		}
	// 	}[]
	// }
}

export type GqlCheckoutUserError = {
	code: string
	field: string[]
	message: string
}

export type GqlCheckoutCreate = {
	checkoutCreate: {
		checkoutUserErrors: GqlCheckoutUserError[]
		checkout: GqlCheckout
	}
}

