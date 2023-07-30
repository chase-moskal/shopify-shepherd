
import {gql} from "../../tools/gql.js"
import {GraphRequest} from "./types/graph_request.js"

export function make_request_for_checkout_create({
		variant_ids,
	}: {
		variant_ids: string[]
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
						lineItems(first: 250) {
							edges {
								node {
									id
									title
									variant {
										id
										price
										title
									}
									quantity
								}
							}
						}
					}
				}
			}
		`,

		variables: {
			input: {
				lineItems: variant_ids.map(id => ({variantId: id, quantity: 1}))
			},
		},
	}
}

export type GqlCheckout = {
	id: string
	webUrl: string
	lineItems: {
		edges: {
			node: {
				id: string
				title: string
				variant: {
					id: string
					price: string
					title: string
				}
				quantity: number
			}
		}[]
	}
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

