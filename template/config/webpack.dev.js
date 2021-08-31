const webpack = require('webpack')
const path = require('path')

const devConfig = {
    devtool: 'eval-cheap-module-source-map',
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, '../public'),
        hot: true, 
        historyApiFallback: true, 
        publicPath: '/',
        port: 9901
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
}

module.exports = devConfig 
