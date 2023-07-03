
import {PagingDetails} from "./paging_details.js"
import {GqlPaginated} from "../../../requests/units/paginated.js"

export type Fetcher<N> = ({}: PagingDetails) => Promise<GqlPaginated<N>>

