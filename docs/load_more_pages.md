
[🠈 back to readme](../readme.md)

# product paging: implement your own "load more" button logic

```ts
let my_product_catalog = []
let there_are_more_pages = true
const products = shopify.products()

async function my_load_more_button() {
  if (there_are_more_pages) {
    const {value} = await products.next()
    const [new_products, more] = value!
    my_product_catalog = [...my_product_catalog, ...new_products]
    there_are_more_pages = more
  }
}

await my_load_more_button() // initially load the first page
await my_load_more_button() // call it when the user presses the button
```
