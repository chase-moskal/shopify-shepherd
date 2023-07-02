
export class ShepherdError extends Error {
	name = this.constructor.name
}

export class ShopifyResponseError extends ShepherdError {
	constructor({message, path}: {message: string, path: string[]}) {
		super(`${message} ⮞ ${path.join(" 🡪 ")}`)
	}
}

