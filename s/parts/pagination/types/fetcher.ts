
import {GqlEdge} from "./gql_edge.js"
import {PageInfo} from "./page_info.js"
import {PagingDetails} from "./paging_details.js"

export type Fetcher<N> = ({}: PagingDetails) => Promise<{
	edges: GqlEdge<N>[]
	pageInfo: PageInfo
}>

