
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
					checkoutUserErrors {
						code
						field
						message
					}
					checkout {
						id
						webUrl
					}
				}
			}
		`,

		variables: {
			input: {
				lineItems: (line_items
					.filter(remove_items_with_zero_quantity)
					.map(i => ({
						variantId: i.variant_id,
						quantity: i.quantity
					}))
				)
			},
		},
	}
}

function remove_items_with_zero_quantity(item: CheckoutLineItem) {
	return item.quantity < 1
}

export type GqlCheckout = {
	id: string
	webUrl: string
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

