
import {GqlEdges} from "./edges.js"
import {gql} from "../../utils/gql.js"

export const paginated = (node: string) => gql`

	edges {
		node {
			${node}
		}
	}

	pageInfo {
		hasNextPage
		endCursor
	}
`

export type GqlPaginated<N> = GqlEdges<N> & {
	pageInfo: {
		hasNextPage: boolean
		endCursor: string
	}
}

