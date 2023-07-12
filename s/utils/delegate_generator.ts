
export function *delegate_generator(generator: Generator<any>) {
	while (true) {
		const {done, value} = generator.next()

		if (!done)
			yield value
		else
			return value
	}
}

export async function *delegate_async_generator<T>(generator: AsyncGenerator<T>) {
	while (true) {
		const {done, value} = await generator.next()

		if (!done)
			yield value
		else
			return value
	}
}

