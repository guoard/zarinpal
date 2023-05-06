# zarinpal-checkout-ts

This is a TypeScript rewrite of the original [zarinpal-checkout](https://github.com/siamak/zarinpal-checkout) package. It provides a simple interface for interacting with the ZarinPal payment gateway.

## Differences from the original package

- This package uses `got` instead of `request-promise` due to the deprecation of the latter package.

- I removed the `TokenBeautifier` method from the package, which resulted in a major version update to `1.0.0`.

## Installation

To install `zarinpal-checkout-ts`, run:

```bash
npm install zarinpal-checkout-ts
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](./LICENSE)
