const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//importando el eslint

const EslintWebpackPlugin = require('eslint-webpack-plugin');

module.exports={
    // 1.-Establecer el modo
    mode:'development',
    // 2.-Archivo de entrada
    entry:'./client/index.js',
    //3.-Especificando la saldia
    output:{
        //4.-Ruta absoluta de salida
        path:path.join(__dirname,'public'),
        //5.-Nombre del archivo de salida
        filename:'js/bundle.js',
        //6.-Ruta del path publico
        publicPath:'/'
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude:/(node_modules|bower_components)/,
                use: [
                    {
                        loader:'babel-loader',
                        options:{
                            presets:[
                                [
                                    '@babel/preset-env',
                                    {
                                        'modules': false,
                                        'useBuiltIns':'usage',
                                        'targets':{"chrome":"80"},
                                        //'targets':"> 0.25%, not dead",
                                        'corejs':3
                                    }
                                ]
                            ],
                            "plugins":[
                                [
                                    "module-resolver",
                                    {
                                        "root":["./"],
                                        "alias":{
                                            "@client":"./client"
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                ]
            },
            {
                test:/\.css$/,
                use:[MiniCssExtractPlugin.loader,'css-loader']
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'styles/app.css'
        }),
        new EslintWebpackPlugin()
    ]
}