module.exports = {
  plugins: {
    autoprefixer: {},
    // 把 px 转成 rem
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
