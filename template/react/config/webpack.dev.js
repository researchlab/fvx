const webpack = require('webpack')
const path = require('path')

const devConfig = {
    devtool: 'eval-cheap-module-source-map',
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, '../public'),
        historyApiFallback: true, 
        publicPath: '/',
        port: 9901,
        progress: true, // 进度条
        hotOnly: true, //页面构建失败不刷新页面
        hot: true, // 热加载
        open: true, // 自动打开浏览器
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
}

module.exports = devConfig 
