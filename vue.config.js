const { defineConfig } = require('@vue/cli-service')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: './',
  outputDir: "dist",
  assetsDir: './static',
  indexPath: "index.html",
  productionSourceMap: true,

  /* 保存时是否校验 */
  lintOnSave: false,

  /* 开发环境跨域情况的代理配置 */
  devServer: {
    // https: true, // 链接是否使用https访问 但可能在微信中不能打开（安全性问题） 不写此行配置默认 使用http协议打开
    host: '127.0.0.1',
    port: '3000', 	// 指定要监听请求的端口号
    open: true, 	  // 是否运行好直接在默认浏览器打开
    hot: true,		  // 用于设置代码保存时是否进行热更新（局部刷新，不刷新整个页面）

    /* 接口代理器设置 可以配置多个*/
    proxy: {
      '/QQMusicApi': {
        target: 'http://localhost:3300',                   // 实际访问的服务器地址
        secure: false,                // 如果是https接口，需要配置这个参数
        changeOrigin: true,           // 是否跨域
        ws: false,                    // 是否启用websockets
        pathRewrite: { '/QQMusicApi': '' }, // 重写请求路径  开头是/api的替换为 空串
      },
    },
  },

  /* css相关设置 */
  css: {
    extract: process.env.NODE_ENV === 'production',    // 是否使用css分离插件 ExtractTextPlugin  开启extract后，组件样式以内部样式表的形式加载的, 打包的结果会多出一个 css 文件夹以及css 文件。
    sourceMap: false, // 开启 CSS source maps?

    /* 向所有 Sass/Less 样式传入共享的全局变量 */
    loaderOptions: {
      scss: {
        additionalData: '@import "@/assets/css/global.scss";'
      }

    },
  },

  /* 
   * webpack相关配置该对象将会被 webpack-merge 合并入最终的 webpack 配置
   */
  configureWebpack: (config) => {
    console.log(1111111111111)
    console.log(config);      // 这里即webpack的配置对象
    config.module.rules.forEach(val => {
      console.log(val);
    })
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
      // 打包可视化分析
      // config.plugins.push(new BundleAnalyzerPlugin());


      /* config.plugins.push(
        // 使用UglifyJsPlugin去掉console 可以略微降低文件大小
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true,  //生产环境自动删除console
            },
            warnings: false,
          },
          sourceMap: false,
          parallel: true //使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        })
      ); */


      //打包文件大小配置
      /* config["performance"] = {
        "maxEntrypointSize": 10000000,
        "maxAssetSize": 30000000
      } */
    } else {
      // 为开发环境修改配置...
      config.mode = "development";
    }
  },

  /* 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作) */
  chainWebpack: (config) => {
    //添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('layout', resolve('src/layout'))
      .set('static', resolve('src/static'));
  },

  /* 第三方插件配置 */
  pluginOptions: {
    'process.env': {
      NODE_ENV: '"development"',
    },
    // 我这里用的是 vue-cli-plugin-mock 插件；用来开发前期模拟后端的请求
    // debug 为true时 vscode的控制台会打印接口日志
    mock: { entry: './mock/index.js', debug: true },
  },

})
