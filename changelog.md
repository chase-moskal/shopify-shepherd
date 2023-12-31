
## v0.2.2

- added `sort` and `reverse` options to `shopify.products`
  - the default value for `sort` is `BEST_SELLING`
- added `filters` option to `shopify.products_in_collection`
  - previously, these collection queries had filter `available: true` hard-coded
  - now we want to be able to display sold-out items on purpose
  - so, we've changed the default behavior -- now, sold-out items will be returned in collection queries
  - we've added `filters` option, where you can supply shopify graphql filters, currently, only specifying `available` is supported
  - to return only in-stock products, provide `filters: [{available: true}]`
  - to return only out-of-stock products, provide `filters: [{available: false}]`
  - to return all the products, provide `filters: []` or `filters: [{}]`

## v0.2.0

- (!) tweaked `shopify.specific_products` return type
  - used to be `Promise<GqlProduct[]>`
  - now is `Promise<(GqlProduct | null)[]>`
- `shopify.checkout` now silently discards items with zero quantity

## v0.1.1

- (!) rework pagination
  - our generators no longer use `return` statements
  - instead, all values are supplied via `yield`
  - this fixes a bug with `for await` loops -- for loops ignore returned data
  - this means we cannot use native `done` as a signal for the end of the data (when `done` is true, the `value` is discarded by for loops)
  - so we've implemented our own `PageReport<N>` type and `PageGenerator<N>` type
    ```ts
    const {value, done} = await page_generator.next()
    const [nodes, more] = value!
    ```
    - now we rely on our own `more` instead of `done` to indicate that no more nodes are available
- (!) rename `ShepherdError` to `ShopifyShepherdError`
- (!) change Shopify constructor signature to use an options object
- (!) make various Gql types optional, like variant.image, product.featuredImage, etc
- add `shopify.checkout({line_items: []})`
- add `shopify.specific_products({ids: []})`
- i reorganized the directories and files a lot, but i don't think there are any breaking changes
- added `Shopify.first` helper for getting only the first page
- add `shopify.product()` for getting info on a single product
- add `ShopifyNotFoundError`

