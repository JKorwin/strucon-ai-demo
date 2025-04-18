// next.config.mjs

import webpack from 'webpack';

/** @type {import('next').NextConfig} */
export default {
  webpack(config) {
    // 1) Stub out node-canvas so pdfjs-dist's fake worker never tries to load it
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    // 2) Ignore any import/require of pdf.worker.js in the legacy build
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /pdf\.worker(\.min)?\.js$/,
      })
    );

    return config;
  },
};