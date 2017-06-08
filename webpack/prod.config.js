const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var OfflinePlugin = require('offline-plugin');

module.exports = {
    devtool: 'source-map',

    entry: ['bootstrap-loader/extractStyles'],

    output: {
        publicPath: 'www/dist/',
    },

    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css!postcss-loader!sass',
        }],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
            __DEVELOPMENT__: false,
        }),
        new ExtractTextPlugin('orakWlum.css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
        new OfflinePlugin({
            ServiceWorker:{
                entry: 'sw.js',
                events: true,
            }
        }),
    ],
};
