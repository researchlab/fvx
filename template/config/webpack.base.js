const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev');
const proConfig = require('./webpack.pro');

const Appconfig = {
    entry:{
        main: './src/index.jsx'
    },
    output:{
        path: path.resolve(__dirname, '../public'),
        filename: '[name].js'
    },
    resolve:{
        extensions:['.jsx','.tsx','.ts','.js']
    },
    module: {
        rules:[
            {
                test: /\.css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions:{
                                plugins:[
                                    ['autoprefixer'],
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options:{
                            postcssOptions:{
                                plugins:[
                                    ['autoprefixer'],
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../src'),
                use: ['happypack/loader?id=babel']
            }
        ]
    },
    optimization:{
        splitChunks:{
            chunks: 'all'
        }
    },
    plugins:[
       new htmlWebpackPlugin({
           filename: 'index.html',
           template: 'src/index.html'
       }),
       new MiniCssExtractPlugin({
           filename: '[name].css'
       }),
       new HappyPack({
           id: 'babel',
           loaders:['babel-loader?cacheDirectory']
       })
    ]
}

module.exports = env => {
    if (env && env.production){
        return merge(Appconfig, proConfig)
    } else {
        return merge(Appconfig, devConfig)
    }
}