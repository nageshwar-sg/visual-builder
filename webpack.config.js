const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "auto",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "visual_builder",
      filename: "remoteEntry.js",
      exposes: {
        "./VisualBuilder": "./src/components/VisualBuilder",
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
        "@mui/material": { singleton: true, requiredVersion: false },
      },
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_CONTENT_STACK_API_KEY": JSON.stringify(
        process.env.REACT_APP_CONTENT_STACK_API_KEY
      ),
      "process.env.REACT_APP_CONTENT_STACK_MANAGEMENT_TOKEN": JSON.stringify(
        process.env.REACT_APP_CONTENT_STACK_MANAGEMENT_TOKEN
      ),
      "process.env.CONTENT_STACK_ENVIRONMENT": JSON.stringify(
        process.env.CONTENT_STACK_ENVIRONMENT
      ),
      "process.env.CONTENT_STACK_REGION": JSON.stringify(
        process.env.CONTENT_STACK_REGION
      ),
      "process.env.CONTENT_STACK_LANGUAGE": JSON.stringify(
        process.env.CONTENT_STACK_LANGUAGE
      ),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
};
