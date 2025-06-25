const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (config) => {
  return {
    ...config,
    mode: 'production',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        buffer: require.resolve('buffer/'),
        vm: require.resolve('vm-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
        assert: require.resolve('assert/'),
        process: require.resolve('process/browser.js'),
        net: false,
        tls: false,
        fs: false,
        path: false,
      },
    },
    plugins: [
      ...(config.plugins || []),
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser.js',
      }),
    ],
    output: {
      ...config.output,
      libraryTarget: 'commonjs2',
    },
  };
};
