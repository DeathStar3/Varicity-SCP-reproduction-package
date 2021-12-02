const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {

    entry: {
      'main': path.resolve(appDirectory, "src/main.ts"),
      'parserTest':'./tests/parser.test.ts',
      'parserVPTest':'./tests/parserVP.test.ts',
      'login':path.resolve(appDirectory, 'src/controller/ui/login.controller.ts'),
      'experiment':path.resolve(appDirectory,'src/controller/experiment/experiment.controller.ts')
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
        new HtmlWebpackPlugin({
            chunks:['login'],
            template: path.resolve(appDirectory, "public/index.html")
        }),
        new HtmlWebpackPlugin({
          chunks:['main'],
          template: path.resolve(appDirectory, "public/ui.html"),
          filename: 'ui.html'
        }),
        new HtmlWebpackPlugin({
          chunks:['experiment'],
          template: path.resolve(appDirectory, "public/experiment.html"),
          filename: 'experiment.html'
        }),
        new CleanWebpackPlugin()
    ],
    mode: "development"
  }
