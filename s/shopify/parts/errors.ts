
export class ShopifyShepherdError extends Error {
	name = this.constructor.name
}

export class ShopifyResponseError extends ShopifyShepherdError {
	constructor({message, path}: {message: string, path: string[]}) {
		super(`${message} ⮞ ${path.join(" 🡪 ")}`)
	}
}

export class ShopifyNotFoundError extends ShopifyShepherdError {
	constructor(subject: string) {
		super(`not found (${subject})`)
	}
}

