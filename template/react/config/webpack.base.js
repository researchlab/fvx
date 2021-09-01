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
			    test: /\.(png|jpe?g|gif|svg|ttf|eot|woff|woff2)$/,
        		use: {
        		  loader: 'url-loader',
        		  options: {
        		    esModule: false,
        		    name: '[name]_[hash].[ext]',
        		    outputPath: 'imgs/',
        		    limit: 2048
        		  }
        		}
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
                test: /\.less$/,
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
                    'less-loader'
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
           filename: 'index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
           template: 'src/index.html', // 源模板文件
           // inejct: 向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不经相同。
           // 	1、true或者body：所有JavaScript资源插入到body元素的底部
           // 	2、head: 所有JavaScript资源插入到head元素中
           // 	3、false： 所有静态资源css和JavaScript都不会注入到模板文件中
           inject:true,
           favicon: path.resolve(__dirname,'../src/assets/images/favicon.ico') //动态添加favicon
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
