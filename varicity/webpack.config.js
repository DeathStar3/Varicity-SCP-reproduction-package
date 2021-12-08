const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {

    entry: {
        'main': path.resolve(appDirectory, "src/main.ts"),
        'parserTest': './tests/parser.test.ts',
        'parserVPTest': './tests/parserVP.test.ts'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    output: {
        globalObject: 'this',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx']
    },
    devServer: {
        host: '0.0.0.0',
        port: 9090, //port that we're using for local host (localhost:9090)
        hot: true
        /* object { allowedHosts?, bonjour?, client?, compress?, devMiddleware?, headers?, historyApiFallback?, host?, hot?,
           http2?, https?, ipc?, liveReload?, magicHtml?, onAfterSetupMiddleware?, 
          onBeforeSetupMiddleware?, onListening?, open?, port?, proxy?, server?, setupExitSignals?, static?, watchFiles?, webSocketServer? }*/
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ya?ml$/,
                type: "json",
                use: "yaml-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin(
            {patterns: [
                { from: 'images/**/*', to: 'images/', context: 'public/' },
                    { from: 'scripts/**/*', to: 'scripts/', context: 'public/' },
                    { from: 'styles/**/*', to: 'styles/', context: 'public/' },
                    { from: 'favicon.ico', to: 'favicon.ico', context: 'public/' }
                ]
            }

        ),
        new HtmlWebpackPlugin({
            chunks: ['main'],
            template: path.resolve(appDirectory, "public/index.html")
        }),

        new CleanWebpackPlugin()
    ],
    mode: "development"
}
