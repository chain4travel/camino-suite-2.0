//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  reactStrictMode: true,
  // Use static export for Vercel
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Add these for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
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

      config.plugins = [
        ...config.plugins,
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js',
        }),
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

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
