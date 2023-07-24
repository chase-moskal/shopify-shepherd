
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

