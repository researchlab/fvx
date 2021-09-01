const TerserPlugin = require('terser-webpack-plugin')
const proConfig = {
    devtool: 'source-map',
    mode: 'production',
    optimization:{
        minimizer:[
            new TerserPlugin({
                parallel: true,
            })
        ]
    }
}

module.exports = proConfig 