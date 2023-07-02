
import {gql} from "../utils/gql.js"
import {GraphRequest} from "./types/graph_request.js"

export function make_request_for_shop(): GraphRequest {
	return {
		query: gql`
			query FetchShopInfo {
				shop {
					name
					description
					shipsToCountries
					paymentSettings {
						currencyCode
						countryCode
					}
				}
			}
		`,
	}
}
