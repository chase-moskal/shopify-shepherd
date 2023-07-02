
![shopify-shepherd](./assets/shepherd.webp)

# 🙚 shopify-shepherd 🙘

### *unofficial frontend js sdk for shopify*

📦 `npm i shopify-shepherd`  
♻️ replaces the official [shopify-buy sdk](https://www.npmjs.com/package/shopify-buy)  
🐏 powers [sheep-cart](https://github.com/chase-moskal/sheep-cart#readme) store ui  
🛡️ written in typescript  
🗿 zero dependencies  
🤝 extensible and open to pull requests  
💖 free and open source  

<br/>

**but why not just use shopify's official sdk?**  
it's poorly maintained, semi-abandoned, and missing features that i need for building [sheep-cart](https://github.com/chase-moskal/sheep-cart#readme).

<br/>

## 🕹️ how to use shepherd

1. **install shopify-shepherd**
    ```sh
    npm i shopify-shepherd
    ```

1. **instance the sdk and provide your shopify credentials**
    ```ts
    import {Shopify} from "shopify-shepherd"

    const shopify = Shopify.make({
      domain: "dev-bakery.myshopify.com",
      storefront_access_token: "5f636be6b04aeb2a7b96fe9306386f25",
    })
    ```
    - in your shopify admin, you need to [create a custom storefront app](https://help.shopify.com/en/manual/apps/app-types/custom-apps) and obtain an access token there

1. **fetch all products and shop info**
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

1. ⚙️ **understanding shopify's pagination model**
    - shopify supports the kind of pagination that is good for a *"load more" or "next page"* button (or the on-scroll kind)
    - shopify does *not* support the kind of pagination that has distinct and identifiable pages, like *"page 1",* *"page 2",* etc

1. 🛒 **paging through products**  
    shepherd presents pagination as a javascript [async generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator)  
    ```ts
    // sequentially fetch every page of products
    for await (const page of shopify.products())
      console.log(page)

    ```
    you can use the generator manually to go page-by-page [(maybe refresh yourself on iterators and generators)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)  
    ```ts
    // or, you can use the generator manually
    const products = shopify.products()

    //
    // getting the first page
    //

    const page1 = await products.next()

    console.log(page1.value)
      //⮞ [{id: "xyz123", name: "My Product", ...}, ...]

    console.log(page1.done)
      //⮞ false

    //
    // getting the second page
    //

    const second_page = await products.next()

    console.log(page2.value)
      //⮞ [{id: "xyz234", name: "Another Product", ...}, ...]

    console.log(page2.done)
      //⮞ true
    ```
    you can implement your own "load more" button logic with the generator  
    ```ts
    // array of products to display to the user
    let my_product_catalog = []

    // when this is true, show the user a "load more" button
    let there_are_more_pages = true

    // create the products generator
    const products = shopify.products()

    // call this function whenever the user presses your "load more" button
    async function my_load_more_button() {
      if (there_are_more_pages) {
        const {value, done} = await products.next()
        my_product_catalog = [...my_product_catalog, ...value]
        there_are_more_pages = !done
      }
    }

    // load the first page of products
    await my_load_more_button()

    // call it again when the user presses your "load more" button
    await my_load_more_button()
    ```

1. 📚 **paging through collections works the same way**
    ```ts
    // log every page of collections
    for await (const page of shopify.collections())
      console.log(page)
    ```

1. 🪄 **you can use the `Shopify.all` helper to grab all pages**
    ```ts
    // grab all products
    const all_products = await Shopify.all(shopify.products())

    // grab all collections
    const all_collections = await Shopify.all(shopify.collections())
    ```

<br/>

## 🌎 shepherd can list which countries you ship to

1. **fetch your shop info**  
    ```ts
    const shop = await shopify.shop()

    console.log(shop.shipsToCountries)
      //⮞ ["CA", "US", "MX", "XX"]
    ```
    - shopify provides your shippable countries in two-letter ISO-3166 alpha-2 format
    - whereas users probably want to see the full names of the countries
    - so shepherd provides a utility for that

1. **separately import shepherd's `CountryLibrary`**
    ```ts
    import {CountryLibrary} from "shopify-shepherd/x/countries.js"
    ```
    - the country data weighs `15 K`
    - it's an optional import, so you don't have to include that data in your bundle if you don't use it

1. **use the country library to show pretty names to users**
    ```ts
    const countries = new CountryLibrary().query_names(shop.shipsToCountries)

    console.log("countries we ship to: " + countries.join(", "))
      //⮞ countries we ship to: Canada, United States of America, Mexico, XX
    ```
    - 🤷‍♂️ sometimes shopify provides two-letter codes that are not in the [ISO-3166 data](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes) we're using -- so you might get some two-letter codes at the end of the list
    - if you need more control, you can use [query](./s/parts/countries/country_library.ts#L19) instead of `query_names`
