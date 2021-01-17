var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	resolve: {
		extensions: [ '.js', '.jsx' ]
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader'
			},
			{ test: /\.css$/i, use: [ 'style-loader', 'css-loader' ] },
			{
				test: /.(ttf|gif|png|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				exclude: /images/ /* dont want svg images from image folder to be included */,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'fonts/',
							name: '[name][hash].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
	devServer: {
		historyApiFallback: true,
		hot: true
	},
	externals: {
		// global app config object
		config: JSON.stringify({
			apiUrl: 'http://localhost:9000/api',
			defaultZoneFilters : {
				page: 1,
				pageSize: 10,
				filter: '*',
				sortField: 'ZoneName',
				sortOrder: 'ASC',
			}
		})
	}
};
