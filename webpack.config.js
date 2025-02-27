const chalk = require('chalk');
const { resolve, join } = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const enableFastRefresh =
    process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'cc' && process.env.NODE_ENV !== 'production';
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');

const port = 2020;
const url = process.env.URL || 'localhost';
const useMock = !!process.env.USE_MOCK || false;
const publicPath = '';

module.exports = {
    mode: 'development',
    context: resolve(__dirname),
    devtool: 'source-map',
    entry: {
        browserUpdate: join(__dirname, 'public', 'browser-update.js'),
        webpackDevClient: `webpack-dev-server/client?http://${url}:${port}`,
        webPackDevServer: 'webpack/hot/only-dev-server',
        index: join(__dirname, 'src', 'index.js'),
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname),
        pathinfo: true,
        publicPath: `http://${url}:${port}/${publicPath}`,
        // assetModuleFilename: 'images/[hash][ext][query]' // TBD
    },
    devServer: {
        // client: {
        //     logging: 'info',
        // },
        compress: true,
        // contentBase: __dirname,
        // devMiddleware: {
        //     publicPath: '/public', // `/${publicPath}`,
        //     // stats: 'errors-only',
        // },
        headers: { 'X-Custom-Header': 'yes' },
        historyApiFallback: true,
        host: url,
        // hot: true,
        https: false,
        // inline: true,
        // lazy: false,
        // noInfo: true,
        open: false,
        port: port,
        // publicPath: `/${publicPath}`,
        // quiet: false,
        // stats: 'errors-only',
        // watchContentBase: false,
        // disableHostCheck: true,
        proxy: {
            '/api/staging': {
                target: 'https://api.library.uq.edu.au',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
        // static: {
        //     directory: path.join(__dirname, 'public'),
        //     watch: false,
        // },
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [resolve(__dirname, 'src')],
                exclude: [/node_modules/, /custom_modules/, '/src/mocks/'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-export-default-from',
                            enableFastRefresh && 'react-refresh/babel',
                        ].filter(Boolean),
                    },
                },
            },
            {
                test: /\.json$/,
                exclude: [/node_modules/, /custom_modules/],
                use: ['json-loader'],
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss|\.styl/,
                include: [resolve(__dirname, 'src')],
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: join(__dirname, 'public', 'favicon.ico'),
            filename: 'index.html',
            reusablejs: 'https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js',
            // reusablejs: 'http://localhost:8080/uq-lib-reusable.min.js', // swap if needed in dev
            inject: true,
            template: join(__dirname, 'public', 'index.html'),
        }),
        new HtmlWebpackPlugin({
            template: './public/chatbot.html',
            filename: 'chatbot.html',
            chunks: [], // No JS chunks needed for this page
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(
                ':percent',
            )} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        enableFastRefresh && new ReactRefreshWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {
                    includePaths: [resolve(__dirname, './src')],
                    outputStyle: 'expanded',
                    sourceMap: true,
                },
                eslint: {
                    configFile: '.eslintrc',
                    failOnWarning: false,
                    failOnError: true,
                },
                postcss: {},
                context: join(__dirname),
            },
        }),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: true,
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.USE_MOCK': JSON.stringify(useMock),
            'process.env.APP_URL': JSON.stringify(`http://${url}:${port}/`),
            'process.env.FULL_PATH': JSON.stringify(process.env.FULL_PATH),
            'process.env.TITLE_SUFFIX': JSON.stringify('LOCAL'),
            'process.env.ENABLE_LOG': JSON.stringify(
                !!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'cc',
            ),
            'process.env.BRANCH': JSON.stringify('development'),
            'process.env.GIT_SHA': JSON.stringify(process.env.CI_COMMIT_ID),
            'process.env.SESSION_COOKIE_NAME': JSON.stringify(process.env.SESSION_COOKIE_NAME),
        }),
        new Dotenv(),
        new MomentTimezoneDataPlugin({
            matchZones: /^Australia\/Brisbane/,
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    resolve: {
        descriptionFiles: ['package.json'],
        enforceExtension: false,
        extensions: ['.jsx', '.js', '.json'],
        modules: ['src', 'node_modules', 'custom_modules'],
        alias: {
            '@material-ui/styles': resolve(__dirname, 'node_modules', '@material-ui/styles'),
        },
        fallback: {
            'process/browser': require.resolve('process/browser'),
        },
    },
    optimization: {
        splitChunks: {
            minChunks: 6,
            cacheGroups: {
                commons: {
                    chunks: 'all',
                },
            },
        },
    },
};
