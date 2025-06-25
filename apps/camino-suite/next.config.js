//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Align with your store's webpack config
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
        'node:crypto': false,
        'node:buffer': false,
        'node:process': false,
        'node:util': false,
        'node:stream': false,
        'node:url': false,
      };

      config.resolve.alias = {
        ...config.resolve.alias,
        process: 'process/browser.js',
      };

      // Add plugins - use imported webpack instead of config.webpack
      config.plugins = [
        ...config.plugins,
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js',
        }),
        // Handle node: imports
        new webpack.NormalModuleReplacementPlugin(
          /node:process/,
          (resource) => {
            resource.request = 'process/browser.js';
          }
        ),
        new webpack.NormalModuleReplacementPlugin(/node:crypto/, (resource) => {
          resource.request = 'crypto-browserify';
        }),
        new webpack.NormalModuleReplacementPlugin(/node:buffer/, (resource) => {
          resource.request = 'buffer';
        }),
      ];

      // Add ignore warnings to reduce noise
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        {
          module: /node_modules\/@reduxjs\/toolkit/,
        },
        {
          module: /node_modules\/axios/,
        },
        {
          module: /node_modules\/ethers/,
        },
        {
          module: /node_modules\/@c4tplatform\/caminojs/,
        },
      ];
    }
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
