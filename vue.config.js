module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/styles/_index";`
      }
    }
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}