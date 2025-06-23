// libs/store/webpack.config.js
const webpack = require('webpack');
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (config) => {
  return {
    ...config,
    mode: 'production',
    entry: './src/index.ts',
    context: path.resolve(__dirname),
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: ['@babel/plugin-transform-runtime'],
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
        process: require.resolve('process/browser.js'), // Note the .js extension
        net: false,
        tls: false,
        fs: false,
        path: false,
      },
      alias: {
        process: 'process/browser.js',
      },
    },
    plugins: [
      ...(config.plugins || []),
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser.js',
        React: 'react',
      }),
      // Important: This helps with ESM compatibility issues
      new webpack.NormalModuleReplacementPlugin(/node:process/, (resource) => {
        resource.request = 'process/browser.js';
      }),
    ],
    output: {
      ...config.output,
      libraryTarget: 'commonjs2',
      filename: '[name].js',
    },
    externals: {
      react: 'commonjs react',
      'react-dom': 'commonjs react-dom',
      'react-redux': 'commonjs react-redux',
    },
    experiments: {
      outputModule: false, // Disable ESM output to avoid compatibility issues
    },
    // This is important to handle the ESM modules correctly
    ignoreWarnings: [
      {
        module: /node_modules\/@reduxjs\/toolkit/,
      },
      {
        module: /node_modules\/axios/,
      },
    ],
  };
};
