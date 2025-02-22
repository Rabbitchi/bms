'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const webpack = require('webpack')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template'

module.exports = {
    publicPath: '/product-factory-web/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    css: {
        sourceMap: process.env.NODE_ENV === 'development',
        loaderOptions: {
            sass: {
                // 全局sass变量
                //sass-loader 新版本
                additionalData: `@import "~@/styles/index.scss";`
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            },
            fallback: {
                "path": require.resolve("path-browserify")
            },
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
        ]
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        config
            // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === 'development',
                config => config.devtool('cheap-source-map')
            )


        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {
                                libs: {
                                    name: 'chunk-libs',
                                    test: /[\\/]node_modules[\\/]/,
                                    priority: 10,
                                    chunks: 'initial' // only package third parties that are initially dependent
                                },
                                elementUI: {
                                    name: 'chunk-elementUI', // split elementUI into a single package
                                    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                                },
                                commons: {
                                    name: 'chunk-commons',
                                    test: resolve('src/components'), // can customize your rules
                                    minChunks: 3, //  minimum common number
                                    priority: 5,
                                    reuseExistingChunk: true
                                }
                            }
                        })
                    config.optimization.runtimeChunk('single')
                }
            )
    },
    // 开发环境
    devServer: {
        // host: 'localhost',
        port: 9536,
        // proxy: {
        //     // '/ent-web': {
        //     //     target: process.env.VUE_APP_BASE_URL,
        //     //     changeOrigin: true,
        //     //     pathRewrite: {
        //     //         '^/ent-web': ''
        //     //     }
        //     // },
        //     '/api': {
        //         // target: process.env.VUE_APP_BASE_URL,
        //         target: 'http://test-app.antpesa.vip',
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         },
        //         onProxyRes(proxyRes, req, res) {
        //             const realUrl = process.env.VUE_APP_BASE_URL + req.url || ''; // 真实请求网址
        //             console.log('realUrlr', realUrl); // 在终端显示
        //             proxyRes.headers['A-Real-Url'] = realUrl; // 添加响应标头(A-Real-Url为自定义命名)，在浏览器中显示
        //         },
        //     },
            
        //     '/': {
        //         // target: process.env.VUE_APP_BAS_API_UPLOAD, // 本地后端地址
        //         target: process.env.VUE_APP_BASE_URL, // 本地后端地址

        //         // target: "http://test-app.antpesa.vip/ent-web/web", // 本地后端地址
        //         changeOrigin: true, //允许跨域
        //         ws: false,
        //         pathRewrite: {
        //             "^/api": "/",
        //             // pathRewrite: { '^/api': '/' } //重写之后url为 http://localhost：8080/xxxx
        //             // pathRewrite: { '^/api': '/api' } //重写之后url为http://localhost：8080/api/xxxx
        //         },
        //     }
        // }
    },
}