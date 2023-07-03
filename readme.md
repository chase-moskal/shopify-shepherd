
![shopify-shepherd](./assets/shepherd.webp)

# 🙚 shopify-shepherd 🙘

### *unofficial frontend js sdk for shopify*

shopify-shepherd makes it easy to communicate with the shopify storefront api from in-browser javascript.  
you can build a whole shopping experience for your users, all in-browser, without running any backend api services yourself.

♻️ replaces the official [shopify-buy sdk](https://www.npmjs.com/package/shopify-buy)  
🐏 powers [sheep-cart](https://github.com/chase-moskal/sheep-cart#readme) store ui  
🛡️ written in typescript  
🗿 zero dependencies  
🤝 extensible and open to pull requests  
💖 free and open source  
📦 `npm i shopify-shepherd`  

<br/>

**but why not just use shopify's official sdk?**  
it's poorly maintained, semi-abandoned, and missing features that i need for building [sheep-cart](https://github.com/chase-moskal/sheep-cart#readme).

<br/>

## 🕹️ how to use shepherd

1. 📦 **install shopify-shepherd**
    ```sh
    npm i shopify-shepherd
    ```

1. 🆕 **instance the sdk, providing your shopify credentials**
    ```ts
    import {Shopify} from "shopify-shepherd"

    const shopify = Shopify.make({
      domain: "dev-bakery.myshopify.com",
      storefront_access_token: "5f636be6b04aeb2a7b96fe9306386f25",
    })
    ```
    - in your shopify admin, you need to [create a custom storefront app](https://help.shopify.com/en/manual/apps/app-types/custom-apps) and obtain an access token there

1. 📥 **fetch all products and shop info**
    ```ts
    const {
      shop,
      products,
      collections,
    } = await shopify.fetch_everything_cool()
    ```
    - this is a simple convenience function for no-nonsense folk who want a simple one-push button
    - all fully typed -- you are welcome

<br/>

## 📜 shepherd pagination

1. 📄 **understanding shopify's pagination model**
    - shopify supports the kind of pagination that is good for a *"load more" or "next page"* button (or the on-scroll kind)
    - shopify does *not* support the kind of pagination that has distinct and identifiable pages, like *"page 1",* *"page 2",* etc

1. 🛒 **paging through products**  
    shepherd presents pagination with javascript [async generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator)  
    ```ts
    // sequentially fetch every page of products
    for await (const page of shopify.products())
      console.log(page)
    ```
    manually go page-by-page [(refresh yourself on iterators and generators)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)  
    ```ts
    // use the generator manually
    const products = shopify.products({page_size: 50})
    const page1 = await products.next()
    console.log(page1.value) //⮞ [{id: "a1", ...}, ...]
    console.log(page1.done) //⮞ false
    const page2 = await.products.next()
    ```
    implement your own "load more" button logic  
    ```ts
    let my_product_catalog = []
    let there_are_more_pages = true
    const products = shopify.products()

    async function my_load_more_button() {
      if (there_are_more_pages) {
        const {value, done} = await products.next()
        my_product_catalog = [...my_product_catalog, ...value]
        there_are_more_pages = !done
      }
    }

    await my_load_more_button() // initially load the first page
    await my_load_more_button() // call it when the user presses the button
    ```

1. 📚 **paging through collections works the same way**
    ```ts
    for await (const page of shopify.collections())
      console.log(page)
    ```

1. 🪄 **fetch every page with the `Shopify.all` helper**
    ```ts
    // grab all products
    const all_products = await Shopify.all(shopify.products())

    // grab all collections
    const all_collections = await Shopify.all(shopify.collections())
    ```

<br/>

## 🌎 shepherd knows about countries

1. 📥 **fetch your shop info**  
    ```ts
    const shop = await shopify.shop()

    console.log(shop.shipsToCountries)
      //⮞ ["CA", "US", "MX", "XX"]
    ```
    - shopify provides your shop's shippable countries in two-letter ISO-3166 alpha-2 format
    - but users probably want to see the full names of the countries
    - so shepherd provides a utility for that

1. ⏳ **separately import shepherd's `CountryLibrary`**
    ```ts
    import {CountryLibrary} from "shopify-shepherd/x/countries.js"
    ```
    - the country data weighs `15 K`
    - it's an optional import, so you can choose if you want to bring that data into your bundle

1. 💅 **use the country library to show pretty names to users**
    ```ts
    const countries = new CountryLibrary().query_names(shop.shipsToCountries)

    console.log("countries we ship to: " + countries.join(", "))
      //⮞ countries we ship to: Canada, United States of America, Mexico, XX
    ```
    - 🤷 sometimes shopify provides two-letter codes that are not in the [ISO-3166 data](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes) we're using -- so you might get some two-letter codes at the end of the list
    - if you need more control, you can use [query](./s/parts/countries/country_library.ts#L19) instead of `query_names`
