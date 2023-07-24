
import {PageGenerator} from "./types/page_generator.js"

export async function all<N>(generator: PageGenerator<N>) {
	const all: N[] = []

	for await (const [nodes] of generator)
		for (const node of nodes)
			all.push(node)

	return all
}

export async function first<N>(generator: PageGenerator<N>) {
	const {value} = await generator.next()
	const [nodes] = value!
	return nodes
}

