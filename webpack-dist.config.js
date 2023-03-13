'use strict';

const { resolve, join } = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackStrip = require('strip-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');

const robotsTxtOptions = {
    policy: [
        {
            userAgent: '*',
            allow: [
                '/$',
                '/index.html$',
                '/contact$',
                '/view/*',
                '/data/*',
                '/assets/*.svg',
                '/sitemap/*.xml',
                '/list-by-year/*.html',
                '/*.js',
                '/*.css',
            ],
            disallow: ['/'],
        },
    ],
    sitemap: 'https://library.uq.edu.au/sitemap/sitemap-index.xml',
};

// get branch name for current build, if running build locally CI_BRANCH is not set
// (it is available when run in AWS codebuild)
const branch = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';

// get configuration for the branch
const config = require('./config').default[branch] || require('./config').default.development;

// local port to serve production build
const port = 9000;

// use mock data if required
const useMock = (process && process.env && !!process.env.USE_MOCK) || false;

// config for development deployment
if (config.environment === 'development') {
    config.basePath += branch + '/';
}

/**
 * Get some Git Commit Hash information.
 *
 * [currentCommitHash] (the most recent commit) is used in the path naming
 * for JS and CSS files, both for cache busting and to simplify housekeeping.
 *
 * [outputLastCommitHashes] when called will generate a file [hashFilenameFull] containing X amount of
 * previous commit hashes. This is used to perform housekeeping tasks
 * on files stored in the production S3 bucket.
 * Note: any errors occurred making this call will populate the [hashErrorFilenameFull] file
 * with details as to the cause.
 */

const { spawnSync, execSync } = require('child_process');
const fs = require('fs');

const outputLastCommitHashes = ({
    outputPath = resolve(__dirname, './dist/'),
    amount = 20,
    hashFilename = 'hash.txt',
    errorFilename = 'hashErrors.txt',
} = {}) => {
    const hashFilenameFull = `${outputPath}/${hashFilename}`;
    const hashErrorFilenameFull = `${outputPath}/${errorFilename}`;

    // get last [amount] commit hashes
    const stdio = [0, fs.openSync(hashFilenameFull, 'w'), fs.openSync(hashErrorFilenameFull, 'w')];
    spawnSync('git', ['log', '--format="%h"', `-n ${amount}`], { stdio });
};

// get last commit hash, and use in output filenames.
const currentCommitHash = execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

/** */

const webpackConfig = {
    mode: 'production',
    // The entry file. All your app roots from here.
    entry: {
        browserUpdate: join(__dirname, 'public', 'browser-update.js'),
        main: resolve(__dirname, './src/index.js'),
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'moment'],
    },
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', config.basePath),
        filename: `frontend-js/${currentCommitHash}/[name]-[contenthash].min.js`,
        publicPath: config.publicPath,
    },
    devServer: {
        contentBase: resolve(__dirname, './dist/', config.basePath),
        compress: true,
        port: port,
        host: '0.0.0.0',
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './public', 'favicon.ico'),
            filename: 'index.html',
            title: config.title,
            gtm: config.gtm,
            inject: true,
            template: resolve(__dirname, './public', 'index.html'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: resolve(__dirname, 'public', '404.js'),
                    to: resolve(__dirname, './dist/', config.basePath),
                },
            ],
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(
                ':percent',
            )} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        new MiniCssExtractPlugin({
            filename: `frontend-css/${currentCommitHash}/[name]-[contenthash].min.css`,
        }),

        // plugin for passing in data to the js, like what NODE_ENV we are in.
        new webpack.DefinePlugin({
            __DEVELOPMENT__: !process.env.CI_BRANCH, // always production build on CI
            'process.env.NODE_ENV': JSON.stringify('production'), // always production build on CI
            'process.env.USE_MOCK': JSON.stringify(useMock),
            'process.env.API_URL': JSON.stringify(config.api),
            'process.env.AUTH_LOGIN_URL': JSON.stringify(config.auth_login),
            'process.env.AUTH_LOGOUT_URL': JSON.stringify(config.auth_logout),
            'process.env.APP_URL': JSON.stringify(config.url(process.env.CI_BRANCH)),
            'process.env.FULL_PATH': JSON.stringify(config.fullPath(process.env.CI_BRANCH)),
            'process.env.BRANCH': JSON.stringify(config.environment),
            'process.env.PUBLIC_PATH': JSON.stringify(config.basePath),
            'process.env.GOOGLE_MAPS_URL': JSON.stringify(config.googleMaps),
            'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
            'process.env.ENABLE_LOG': JSON.stringify(
                !!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'cc',
            ),
            'process.env.TITLE_SUFFIX': JSON.stringify(config.titleSuffix),
            'process.env.GIT_SHA': JSON.stringify(process.env.CI_COMMIT_ID),
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new BundleAnalyzerPlugin({
            analyzerMode: config.environment === 'production' ? 'disabled' : 'static',
            openAnalyzer: !process.env.CI_BRANCH,
        }),
        new RobotstxtPlugin(robotsTxtOptions),
        new MomentTimezoneDataPlugin({
            matchZones: /^Australia\/Brisbane/,
        }),
        {
            // custom plugin that fires at the end of the build process, and outputs
            // a list of the last 20 git hashes to a file. Note that the function is
            // called like this to ensure [outputPath] exists. Were it to be called
            // sooner the command would fail and the build process would bomb.
            // The call to [outputLastCommitHashes] can be moved to the top of the
            // file if the output path does not need to contain [config.basePath].
            apply: compiler => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
                    const outputPath = resolve(__dirname, './dist/', config.basePath);
                    outputLastCommitHashes({ outputPath });
                });
            },
        },
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-',
            minChunks: 5,
            minSize: 40000,
        },
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                parallel: true,
            }),
        ],
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
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-syntax-dynamic-import',
                            ['@babel/plugin-transform-spread', { loose: true }],
                        ],
                    },
                },
            },
            {
                test: /\.scss/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/',
                            publicPath: '/assets/',
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                loader: WebpackStrip.loader('console.log'),
            },
        ],
    },
    resolve: {
        descriptionFiles: ['package.json'],
        enforceExtension: false,
        extensions: ['.jsx', '.js', '.json'],
        modules: ['src', 'node_modules', 'custom_modules'],
        alias: {
            '@material-ui/styles': resolve(__dirname, 'node_modules', '@material-ui/styles'),
        },
    },
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
        hints: 'warning',
    },
};

// this is separated out because it causes local build to fail as the env vars required by Sentry arent available
if (!!process.env.SENTRY_AUTH_TOKEN) {
    /*
     * This plugin requires these ENV vars to be in place:
     * SENTRY_AUTH_TOKEN
     * SENTRY_ORG
     * SENTRY_PROJECT
     * For more info, see https://docs.sentry.io/product/cli/configuration/#environment-variables
     */
    const SentryCliPlugin = require('@sentry/webpack-plugin');

    // if you need to run this locally, create .sentryclirc and add the variables from the codeship env variables
    // per https://docs.sentry.io/learn/cli/configuration/#configuration-file
    // and comment out the if around this section
    webpackConfig.plugins.push(
        new SentryCliPlugin({
            release: process.env.CI_COMMIT_ID,
            include: './dist',
            ignore: ['node_modules', 'webpack-dist.config.js', 'custom_modules'],
        }),
    );
}

module.exports = webpackConfig;
