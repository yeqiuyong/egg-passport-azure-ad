# egg-passport-AzureAd


Azure passport plugin for egg

## Install

Download the project. And put in to ../lib/plugin

## Usage

```js
// config/plugin.js
exports.passportAzureAd = {
  enable: true,
  path: '../lib/plugin/egg-passport-azure-ad',
};
```

## Configuration

```js
// config/config.default.js
exports.passporAzureAd = {
  key: 'your oauth key',
  secret: 'your oauth secret',
  callbackURL: 'http://localhost:3000/passport/azuread/callback'
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE.txt)
