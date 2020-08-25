const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const PwaManifest = require("webpack-pwa-manifest");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = (env, argv) => {
  const isDev = argv.mode !== "production";
  return {
    entry: {
      app: "./src/index.tsx",
    },
    devtool: isDev ? "inline-source-map" : undefined,
    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: (chunkData) => {
        if (chunkData.chunk.name === "sw") {
          return "sw.js";
        } else {
          return !isDev ? "[name].[contenthash].js" : "[id].js";
        }
      },
      chunkFilename: !isDev ? "[name].[contenthash].js" : "[id].js",
    },
    optimization: {
      moduleIds: "hashed",
      // moduleIds: "deterministic",
      // splitChunks: {
      //   cacheGroups: {
      //     vendor: {
      //       test: /node_modules/,
      //       name: "vendor",
      //       chunks: "initial",
      //       enforce: true,
      //     },
      //   },
      // },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        "~": path.join(__dirname, "src"),
        react: path.join(__dirname, "node_modules/react"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "linaria/loader",
              options: {
                sourceMap: process.env.NODE_ENV !== "production",
              },
            },
            "ts-loader",
          ],
        },
        {
          test: /\.svg$/,
          loader: "url-loader",
          options: {
            limit: 2048,
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV !== "production",
              },
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: process.env.NODE_ENV !== "production",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles-[contenthash].css",
      }),
      new HtmlWebpackPlugin({
        template: "html/index.html",
        excludeChunks: ["sw"],
        local: {
          ga: require("./scripts/googleAnalytics"),
        },
      }),
      new CopyWebpackPlugin({
        patterns: ["static/og-image.png"],
      }),
      // new PwaManifest(require("./scripts/webManifest")),
      // new WorkboxPlugin.InjectManifest({
      //   swSrc: "./src/sw/index.ts",
      //   swDest: "sw.js",
      //   maximumFileSizeToCacheInBytes: isDev ? 40 * 1024 ** 2 : 3 * 1024 ** 2,
      //   dontCacheBustURLsMatching: /\.\w{16,}\./,
      // }),
    ]
      .concat(isDev ? [new webpack.HotModuleReplacementPlugin()] : [])
      .concat(process.env.ANALYZER ? [new BundleAnalyzerPlugin()] : []),
    devServer: {
      host: "0.0.0.0",
      historyApiFallback: true,
    },
  };
};
