module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue({ file }) { 
        
        // 判断是否是vant的文件 如果是就使用 37.5为根节点字体大小
        // 否则使用75 因为vant使用的设计标准为375 但是市场现在的主流设置尺寸是750
        // return file.indexOf('vant') !== -1 ? 37.5 : 75;

        let rootValue;
        // vant 37.5 https://github.com/youzan/vant/issues/1181
        if (file && file.dirname && (file.dirname.includes('vant'))) {
          // vant3不起作用
          rootValue = 43.75;
        } else {
          rootValue = 13.5;
          // rootValue = 75;
        }
        return rootValue
      },

      selectorBlackList: ['ababa-'],  // 则是一个对css选择器进行过滤的数组，比如你设置为['el-']，那所有el-类名里面有关px的样式将不被转换，这里也支持正则写法。
      replace: true, 
      mediaQuery: true,               // 媒体查询( @media screen 之类的)中不生效
      propList: ['*'],                // 配置哪些文件中的尺寸需要转化为rem *表示所有的都要转化。移动端放开，PC端注释。
      // exclude: '/src/views/pc',

      /* 
        exclude（String, Regexp, Function）要忽略并保留为px的文件路径。
        如果value是字符串，它将检查文件路径是否包含字符串。
        'exclude' 将匹配 \project\postcss-pxtorem\exclude\path
        如果value是regexp，它将检查文件路径是否与regexp相匹配。
        /exclude/i 将匹配 \project\postcss-pxtorem\exclude\path
        如果value是function，则可以使用exclude function返回true，该文件将被忽略。
        回调函数会将文件路径作为参数传递，它应该返回一个布尔结果。
        function (file) { return file.indexOf('exclude') !== -1; }

      */
      
    },
  },
};

