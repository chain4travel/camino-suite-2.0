// libs/store/webpack.config.js
const webpack = require('webpack');

module.exports = (config, context) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
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
        net: false,
        tls: false,
        fs: false,
        path: false,
      },
    },
    plugins: [
      ...(config.plugins || []),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
      new webpack.NormalModuleReplacementPlugin(
        /node:crypto/,
        require.resolve('crypto-browserify')
      ),
    ],
  };
};
