const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "compass.js",
    library: "Compass",
    libraryTarget: "umd",
  },
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      { test: /\.scss$/, use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader',
      ] },
      { test: /\.(png)$/, use: "file-loader" },
      { test: /\.(svg)$/, use: "svg-inline-loader"},
    ],
  },
};
