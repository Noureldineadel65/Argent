const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
	entry: {
		main: "./src/JS/index.js",
		vendor: "./src/vendor.js",
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/template.html",
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.$": "jquery",
			"window.jQuery": "jquery",
		}),
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.html$/,
				use: ["html-loader"],
			},
			{
				test: /\.(svg|png|jpg|gif)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "[name].[hash].[ext]",
						outputPath: "imgs",
					},
				},
			},
		],
	},
};
