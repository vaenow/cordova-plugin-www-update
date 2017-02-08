

var path = require("path")
var webpack = require("webpack")

module.exports = {
    entry: {
        HotUpdate: path.join(__dirname, "www", "js", "index"),
    },
    output: {
        path: path.join(__dirname, "www", "js-dest"), 
        filename: "[name].js",
    },
    loaders: [
        {
            test:/.js$/, 
            exclude: /node_modules/,
            loader: "babel",
            query: {
                preset: ['es2015']
            }
        },
        {test: /\.css$/,loader:"css"}
    ],
    plugins:[
        new webpack.optimize.UglifyJsPlugin(),
    ]
    
}


