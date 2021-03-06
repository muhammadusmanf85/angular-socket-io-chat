const autoprefixer = require('autoprefixer');
const clone = require('js.clone');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ContextReplacementPlugin = webpack.ContextReplacementPlugin;
const DefinePlugin = webpack.DefinePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = webpack.LoaderOptionsPlugin;

import { root, includeClientPackages } from './helpers';

// Common
export const commonPlugins = [
  new ContextReplacementPlugin(
    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    root('./src'),
    {}
  ),

  new LoaderOptionsPlugin({
    debug: false,
    options: {
      postcss: [
        autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR'] })
      ],
      resolve: {}
    }
  })
];

export const commonConfig = {
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [ root('node_modules') ]
  },

  context: root('./'),

  output: {
    filename: '[name]',
    path: root('target'),
    publicPath: ''
  },

  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.ts$/,
        exclude: [/\.(spec|e2e|d)\.ts$/],
        use: ['ts-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.scss$/,
        use: ['raw-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.json$/,
        use: ['json-loader']
      }
    ],
  }
};

// Client
export const clientPlugins = [
  new CommonsChunkPlugin({
    name: [
      'assets/js/vendor.js',
      'assets/js/polyfills.js'
    ]
  }),

  new HtmlWebpackPlugin({
    chunksSortMode: 'dependency',
    filename: 'index.html',
    hash: true,
    inject: 'body',
    template: './src/index.html'
  })
];

export const clientConfig = {
  target: 'web',

  entry: {
    'assets/js/polyfills.js': './src/polyfills',
    'assets/js/vendor.js': './src/vendor',
    'assets/js/main.js': './src/main'
  },

  output: {
    filename: '[name]',
    chunkFilename: 'assets/js/[chunkhash].js'
  },

  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};


// Server.
export const serverPlugins = [];

export const serverConfig = {
  target: 'node',

  entry: {
    'server/index.js': './src/server'
  },

  output: {
    chunkFilename: 'chunk-[name].js',
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /@angular(\\|\/)material/,
        loader: 'imports-loader?window=>global'
      }
    ]
  },

  externals: includeClientPackages(
    /@angularclass|@angular|angular2-|ng2-|ng-|@ng-|angular-|@ngrx|ngrx-|@angular2|ionic|@ionic|-angular2|-ng2|-ng/
  ),

  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};