const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    // The entry file. All your app roots from here.
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'build'),
    },
    entry: {
        // Polyfills go here too, like babel-polyfill or whatwg-fetch
        main: ['babel-polyfill',
        path.join(__dirname, 'src/index.js')]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    // Where you want the output to go
    output: {
        path: path.join(__dirname, '/build/'),
        filename: 'js/[name]-[hash].js',
        publicPath: '/build/'
    },
    module: {
        // Runs before loaders
        rules: [
          {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env']
                  }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: 'css-loader'
                })
             },
             {
                test: /\.(png|jpg|gif)$/,
                exclude: /(node_modules)/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {}
                  }
                ]
              }
        ]
    },
    plugins: [
        // webpack gives your modules and chunks ids to identify them. Webpack can vary the
        // distribution of the ids to get the smallest id length for often used ids with
        // this plugin

        // handles creating an index.html file and injecting assets. necessary because assets
        // change name because the hash part changes. We want hash name changes to bust cache
        // on client browsers.
        new CleanWebpackPlugin('build'),
        new HtmlWebpackPlugin({
            template: 'src/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        // extracts the css from the js files and puts them on a separate .css file. this is for
        // performance and is used in prod environments. Styles load faster on their own .css
        // file as they dont have to wait for the JS to load.
        new ExtractTextPlugin('css/[name]-[hash].min.css'),
        // handles uglifying js
        new UglifyJsPlugin({
          uglifyOptions: {
            ecma: 8,
            warnings: false,
            output: {
              comments: false,
              beautify: false,
            },
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            safari10: false,
          }
        }),
        new OptimizeCssAssetsPlugin(),
        // creates a stats.json
        new StatsPlugin('webpack.stats.json', {
            source: false,
            modules: false
        }),
        // plugin for passing in data to the js, like what NODE_ENV we are in.
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
};
