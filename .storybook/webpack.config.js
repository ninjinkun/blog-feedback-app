const path = require("path");
const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");
module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: /src\/__tests__/,
    loader: require.resolve('awesome-typescript-loader'),
    options: {
      configFileName: 'tsconfig.storybook.json'
    }
  });
  config.plugins.push(new TSDocgenPlugin()); // optional
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
