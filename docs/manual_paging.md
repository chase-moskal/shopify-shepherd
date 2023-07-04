
[🠈 back to readme](../readme.md)

# product paging: using a js generator

here's how to go page-by-page [(perhaps refresh yourself on js iterators and generators)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)

```ts
const products = shopify.products({page_size: 50})

const page1 = await products.next()
console.log(page1.value) //⮞ [{id: "a1", ...}, ...]
console.log(page1.done) //⮞ false

const page2 = await.products.next()
```
