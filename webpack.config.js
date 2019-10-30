const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');//自动创建html文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');//清除多余文件
module.exports = {
    devtool: 'inline-source-map',// 用于开发调试，方便清楚是那个文件出错 (共有7种)
    entry: './src/index.js',
    output: {
        filename: 'bundle.js', // 输出的文件名
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use:ExtractTextPlugin.extract({
                fallback:"style-loader",
                use:"css-loader"
            })
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallback:"style-loader",
                use:"css-loader!sass-loader"
            })
           // 加载时顺序从右向左 
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
            }
        },{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    // 开启一个虚拟服务器
    devServer: {
        contentBase: './build',
        port: 8081,
        inline: true,
        hot: true
    },
    plugins: [
        // new CleanWebpackPlugin(),//每次编译都会把dist下的文件清除，我们可以在合适的时候打开这行代码，例如我们打包的时候，开发过程中这段代码关闭比较好
        new ExtractTextPlugin("styles.css"),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html' //使用一个模板
        })
    ]
};
// entry 是入口文件
// output 是编译后文件
// __dirname 全局变量 代表当前文件所在文件夹的完整路径
// path.resolve 返回一个路径 __dirname+'/dist'