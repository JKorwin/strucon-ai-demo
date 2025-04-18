// @ts-nocheck
// next.config.js
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * @param {import('webpack').Configuration} config
   * @param {{ isServer: boolean }} context
   * @returns {import('webpack').Configuration}
   */
  webpack(config, { isServer }) {
    if (isServer) {
      // 1) Treat all pdfjs‑dist imports as externals on the server
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        /**
         * @param {{ request: string }} ctx
         * @param {(err: Error|null, result?: string) => void} callback
         */
        ({ request }, callback) => {
          if (request && request.startsWith('pdfjs-dist')) {
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
      ];
    }

    // 2) Stub out `canvas` so PDF.js’s NodeCanvasFactory never fires
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    // 3) Drop any require/import of pdf.worker.js in the legacy bundle
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /pdf\.worker(\.min)?\.js$/,
      })
    );

    return config;
  },
};

module.exports = nextConfig;