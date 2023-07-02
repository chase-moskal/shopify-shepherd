
export type Shop = {
	name: string
	description?: string
	shipsToCountries: string[]
	paymentSettings: {
		currencyCode: string
		countryCode: string
	}
}

