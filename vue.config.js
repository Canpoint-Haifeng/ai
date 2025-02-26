const path = require('path')
const webpack = require('webpack')
// js文件压缩,支持ES6语法压缩
const TerserPlugin = require('terser-webpack-plugin')
const WebpackObfuscator = require('webpack-obfuscator');
// 导入体积分析插件
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 导入速度分析插件
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// 实例化速度分析插件
// const smp = new SpeedMeasurePlugin({
//   outputFormat: 'human'
// })
// 骨架屏
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const cdn = {
  css: [
    '//static-file-01-cdn.canpoint.cn/common/cdn/element-plus/2.4.0/index.css',
  ],
  js: [
    '//static-file-01-cdn.canpoint.cn/common/cdn/vue/3.3.0/vue.global.prod.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/vue-router/4.0.0/vue-router.global.prod.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/vuex/4.0.0/vuex.global.prod.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/axios/1.6.0/axios.min.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/element-plus/2.4.0/index.full.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/echarts/5.4.0/echarts.min.js',
  ],
}
const configProduction = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['thread-loader'], // 多进程多实例构建
      },
    ],
  },
  plugins: [
    // 打包分析器
    // new BundleAnalyzerPlugin(),
    // vue骨架屏插件配置
    new SkeletonWebpackPlugin({
      webpackConfig: {
        entry: {
          app: path.join(__dirname, './src/common/js/skeleton.js'),
        },
      },
      minimize: true, // 选填 SPA 下是否需要压缩注入 HTML 的 JS 代码
      quiet: true, // 选填，在服务端渲染时是否需要输出信息到控制台
      router: {
        mode: 'hash',
        routes: [
          {
            path: '/paper/index',
            skeletonId: 'indexSkeleton',
          },
          {
            path: '/paper/maker',
            skeletonId: 'paperMakerSkeleton',
          },
          {
            path: /^\/paper\/detail/,
            skeletonId: 'paperDetailSkeleton',
          },
        ],
      },
    }),
  ],
  // 用cdn方式引入
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    'element-plus': 'ElementPlus',
    echarts: 'echarts',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      name: 'vendors',
      maxInitialRequests: 3, // 最大初始化加载次数，一个入口文件可以并行加载的最大文件数量，默认1
      cacheGroups: {
        /* page: {
          name: 'chunk-page',
          test: /[\\/]src[\\/]/,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        }, */
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
        // app: {
        //   name: 'css-app',
        //   test: /[\\/]src[\\/]css[\\/]/,
        //   chunks: 'all',
        //   priority: 10,
        //   reuseExistingChunk: true,
        //   enforce: true
        // }
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true, // 是否用缓存
        parallel: 4, // 开启多进程，提升压缩速度
        // minify: TerserPlugin.uglifyJsMinify,
        terserOptions: {
          compress: {
            // warnings: false,
            // drop_console: true, // console
            // drop_debugger: false,
            // pure_funcs: ['console.log'] // 移除console
          },
        },
      }),
    ],
  },
}
module.exports = {
  publicPath: isProduction ? process.env.VUE_APP_SRC : '/', // 基本路径
  outputDir: 'dist', // 输出文件目录
  lintOnSave: !isProduction, // eslint-loader 是否在保存的时候检查
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack配置
  chainWebpack: (config) => {
    // 不支持ie添加babel-polyfill
    config.entry('app').add('babel-polyfill')
    // // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // // 移除 preload 插件
    config.plugins.delete('preload')
    // 配置 版本号
    config.plugin('define').tap((args) => {
      args[0]['process.env'].VUE_APP_VERSION = new Date().getTime()
      return args
    })
    // 生产环境配置
    if (isProduction) {
      // 忽略/moment/locale下的所有文件
      config
        .plugin('ignore')
        .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
      // 打包分析器
      // config.plugin('webpack-bundle-analyzer')
      //   .use(BundleAnalyzerPlugin)
      // 生产环境注入cdn
      config.plugin('html').tap((args) => {
        args[0].cdn = cdn
        args[0].minify.removeAttributeQuotes = false
        return args
      })
    }
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin(
        new WebpackObfuscator(
          {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            stringArray: true,
            stringArrayEncoding: false,
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
          },
          []
        )
      )
        .use("webpack-obfuscator")
        .end()
    })
  },
  // configureWebpack: isProduction ? smp.wrap(configProduction) : {},
  configureWebpack: isProduction ? configProduction : { devtool: 'source-map' },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  // css相关配置
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    // css预设器配置项
    loaderOptions: {
      css: {}, // 这里的选项会传递给 css-loader
      sass: {
        // 引入全局变量样式,@设置的别名,执行src目录
        data: `@import '@/assets/css/variables.scss'; `,
      },
      postcss: {}, // 这里的选项会传递给 postcss-loader
    }, // css预设器配置项
    modules: false, // 启用 CSS modules for all css / pre-processor files.
  },
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // webpack-dev-server 相关配置
  devServer: {
    disableHostCheck: true,
    // open: process.platform === 'darwin',
    host: '0.0.0.0', // 允许外部ip访问
    // host: 'localhost', // 允许外部ip访问
    port: 8080, // 端口
    // https: false, // 启用https
    // overlay: {
    //   warnings: true,
    //   errors: true
    // }, // 错误、警告在页面弹出
    proxy: {
      '/paper-builder': {
        target: 'http://192.168.20.3',
        // target: 'http://192.168.20.100:9001',
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        // pathRewrite: {
        //   // '^/api': ''
        // }
      },
      '/lesson-app': {
        target: 'http://192.168.20.3',//http://192.168.20.42:9005
        // target: 'http://192.168.20.100:9001',
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        // pathRewrite: {
        //   // '^/api': ''
        // }
      }
    } // 代理转发配置，用于调试环境
  },
  // 第三方插件配置
  pluginOptions: {},
}
