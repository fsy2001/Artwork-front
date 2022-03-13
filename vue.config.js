module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'zh',
      localeDir: 'locales',
      enableInSFC: true,
      includeLocales: false,
      enableBridge: true
    }
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:80/',
        changeOrigin: true
      },
    }
  }
}
