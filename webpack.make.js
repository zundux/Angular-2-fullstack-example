'use strict';
/*eslint-env node*/
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
// var fs = require('fs');
var path = require('path');

module.exports = function makeWebpackConfig(options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  var BUILD = !!options.BUILD;
  var TEST = !!options.TEST;
  var E2E = !!options.E2E;
  var DEV = !!options.DEV;

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  if (TEST) {
    config.entry = {};
  } else {
    config.entry = {
      app: './client/app/app.ts',
      polyfills: './client/polyfills.ts',
      vendor: [
        'lodash'
      ]
    };
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if (TEST) {
    config.output = {};
  } else {
    config.output = {
      // Absolute output directory
      path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
      //publicPath: BUILD ? '/' : 'http://localhost:' + env.port + '/',

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    };
  }

  config.resolve = {
    modules: ['node_modules'],
    extensions: ['.js', '.ts']
  };

  if (TEST) {
    config.resolve = {
      modules: [
        'node_modules'
      ],
      extensions: ['.js', '.ts']
    };
  }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (TEST) {
    config.devtool = 'inline-source-map';
  } else if (BUILD || DEV) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
  }

  // Initialize module
  //noinspection Eslint
  config.module = {
    rules: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      use: 'babel-loader',
      include: [
        path.resolve(__dirname, 'client/'),
        path.resolve(__dirname, 'node_modules/lodash-es/')
      ]
    }, {
      // TS LOADER
      // Reference: https://github.com/s-panferov/awesome-typescript-loader
      // Transpile .ts files using awesome-typescript-loader
      test: /\.ts$/,
      use: [{
        loader: 'awesome-typescript-loader',
        options: {
          tsconfig: path.resolve(__dirname, 'tsconfig.client.json'),
          include: [
            path.resolve(__dirname, 'client/')
          ]
        },
      }]
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
      use: 'file-loader'
    }, {
      // Pug HTML LOADER
      // Reference: https://github.com/willyelm/pug-html-loader
      // Allow loading Pug throw js
      test: /\.(jade|pug)$/,
      use: ['html-loader', 'pug-html-loader']
    }, {

      // CSS LOADER
      // Reference: https://github.com/webpack/css-loader
      // Allow loading css through js
      //
      // Reference: https://github.com/postcss/postcss-loader
      // Postprocess your css with PostCSS plugins
      test: /\.css$/,
      loader: !TEST
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files in production builds
        //
        // Reference: https://github.com/webpack/style-loader
        // Use style-loader in development for hot-loading
        ? ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  /**
                   * PostCSS
                   * Reference: https://github.com/postcss/autoprefixer-core
                   * Add vendor prefixes to your css
                   */
                  plugins() {
                    return [
                      require('precss'),
                      require('autoprefixer'),
                      require('autoreset')
                    ];
                  }
                  // config.postcss = [
                  // autoprefixer({
                  //   browsers: ['last 2 version']
                  // })
                  // ];
                }
              }
            ]
            //   {
            //   loaders: [
            //     "css-loader?sourceMap",
            //     'postcss'
            //   ]
            // }
          }
          // 'style', 'css?sourceMap!postcss'
        )
        // Reference: https://github.com/webpack/null-loader
        // Skip loading css in test mode
        : 'null'
    }, {
      // SASS LOADER
      // Reference: https://github.com/jtangelder/sass-loader
      test: /\.(scss|sass)$/,
      use: [{
        loader: 'raw-loader'
      }, {
        loader: 'sass-loader',
        options: {
          outputStyle: 'compressed',
          precision: 10,
          sourceComments: false,
          includePaths: [
            path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
            path.resolve(__dirname, 'client')
          ]
        }
      }],
    }]
  };


  //TODO: TS Instrumenter
  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      // allChunks: true,
      disable: !BUILD || TEST
    })
  ];

  if (!TEST) {
    config.plugins.push(new CommonsChunkPlugin({
      name: 'vendor',

      // filename: "vendor.js"
      // (Give the chunk a different name)

      minChunks: Infinity
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }));
  }

  // Skip rendering index.html in test mode
  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  // Render index.html
  let htmlConfig = {
    template: 'client/_index.pug',
    filename: '../client/index.html',
    alwaysWriteToDisk: true
  };
  config.plugins.push(
    new HtmlWebpackPlugin(htmlConfig),
    new HtmlWebpackHarddiskPlugin()
  );

  // Add build specific plugins
  if (BUILD) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }),

      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    );
  }

  if (DEV) {
    config.plugins.push(
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      }),

      new webpack.HotModuleReplacementPlugin()
    );
  }

  config.cache = DEV;

  if (TEST) {
    config.stats = {
      colors: true,
      reasons: true
    };
    config.debug = false;
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './client/',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  };

  config.node = {
    global: true, //'window',
    process: true,
    crypto: 'empty',
    clearImmediate: false,
    setImmediate: false
  };

  return config;
}
;
