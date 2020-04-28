const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const transpileDependencies = ['three']

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/scripts/index.js'),
    vendor: path.resolve(__dirname, 'src/scripts/vendor.js')
  },
  watchOptions: {
    ignored: ['node_modules', 'dist', 'dist-wp', 'composer', 'cache']
  },
  module: {
    rules: [
      {
        test: /\.(handlebars|hbs)$/,
        include: path.resolve(__dirname, 'src/views/'),
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              helperDirs: path.resolve(__dirname, 'src/views/helpers'),
              partialDirs: path.resolve(__dirname, 'src/views/partials'),
              precompileOptions: {
                knownHelpersOnly: false
              }
            }
          },
          {
            loader: 'markup-inline-loader',
            options: {
              svgo: {
                plugins: [
                  {
                    cleanupIDs: true
                  },
                  {
                    prefixIds: true
                  }
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)$/,
        include: path.resolve(__dirname, 'src/fonts/'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              outputPath: './'
            }
          }
        ]
      },
      {
        test: /masonry-layout/,
        loader: 'imports?define=>false&this=>window'
      },
      {
        test: /\.js$/,
        exclude: new RegExp(
          `node_modules/(?!(${transpileDependencies.join('|')})/).*`
        ),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    regenerator: true
                  }
                ]
              ]
            }
          },
          'eslint-loader'
        ]
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/icons/'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'icons/',
              publicPath: '/icons/'
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: {
                removeAttrs: {}
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        include: path.resolve(__dirname, 'src/images/'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '/images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: true
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      // TODO: Temp fix until next version of CopyPlugin to prevent conflicts
      // https://github.com/webpack-contrib/copy-webpack-plugin/issues/385
      cleanStaleWebpackAssets: false
    }),
    new CopyPlugin([
      {
        from: 'src/static',
        to: ''
      }
    ]),
    new CopyPlugin([
      {
        from: 'src/media',
        to: 'media'
      }
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Ninja | Webpack Flow',
      filename: 'index.html',
      template: './src/views/index.handlebars'
    }),
    new HtmlWebpackPlugin({
      title: 'Ninja | 404',
      filename: '404.html',
      template: './src/views/404.handlebars'
    }),
    new SVGSpritemapPlugin(['src/icons/*.svg'], {
      output: {
        filename: 'icons/sprite.svg',
        chunk: {
          name: 'sprite',
          keep: true
        },
        svgo: {
          plugins: [
            {
              removeAttrs: {}
            }
          ]
        }
      },
      sprite: {
        prefix: false
      },
      styles: {
        filename: 'src/styles/vendor/sprite.scss'
      }
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css'
    }),
    new StyleLintPlugin(),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as (entry) {
        if (/\.(woff|woff2|ttf|otf)$/.test(entry)) return 'font'
      },
      fileWhitelist: [/\.(woff|woff2|ttf|otf)$/],
      include: 'allAssets'
    })
  ]
}
