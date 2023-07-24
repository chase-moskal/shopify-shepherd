
[🠈 back to readme](../readme.md)

# product paging: using async generators

here's how to go page-by-page [(perhaps refresh yourself on js iterators and generators)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)

```ts
const products = shopify.products()

const page1 = await products.next()
const [products, more] = page1.value!
console.log(products) //⮞ [{id: "a1", ...}, ...]
console.log(more) //⮞ false

if (more) {
  const page2 = await.products.next()
  //...
}
```
