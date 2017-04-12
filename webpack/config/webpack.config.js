const path = require("path");
module.exports = {
	entry: './app/index',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	resolve: {
		// Add '.ts' and '.tsx' as a resolvable extension.
	},
	module: {

		loaders: [{
				test: /\.js$/,
				loaders: ['babel'],
				exclude: /node_modules/,
				include: __dirname
			}, {
				test: /\.css$/,
				loader: "style!css"
			}, {
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass', ],
				options: {
					includePaths: [
						path.resolve("./node_modules/bootstrap-sass/assets/stylesheets")
					]
				}
			}, {
				test: /\.less$/,
				loaders: ['style', 'css', 'less']
			}, {
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: ['url-loader?limit=5000&name=img/[hash:8].[name].[ext]']
			}, {
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff"
			}, {
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff2"
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/octet-stream"
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "file"
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=image/svg+xml"
			}]
			/*
						rules: [
							{
									test: /\.js$/,
									loaders: ['babel'],
									exclude: /node_modules/,
									include: __dirname
								}, {
									test: /\.css$/,
									use: ['style-loader', 'css-loader']
								}, {
									test: /\.scss$/,
									use: [{
										loader: "style-loader"
									}, {
										loader: "css-loader",
										options: {
											alias: {
												"../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
											}
										}
									}, {
										loader: "sass-loader",
										options: {
											includePaths: [
												path.resolve("./node_modules/bootstrap-sass/assets/stylesheets")
											]
										}
									}]
								},

							]

						}*/
	}
};