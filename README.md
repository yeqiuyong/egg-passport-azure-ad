# egg-passport-AzureAd


Azure passport plugin for egg

## Install

```bash
$ npm i egg-passport-Azure --save
```

## Usage

```js
// config/plugin.js
exports.passportAzureAd = {
  enable: true,
  package: 'egg-passport-weibo',
};
```

## Configuration

```js
// config/config.default.js
exports.passporAzureAd = {
  key: 'your oauth key',
  secret: 'your oauth secret',
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE.txt)
