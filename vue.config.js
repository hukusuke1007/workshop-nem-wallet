const Dotenv = require('dotenv-webpack')

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/nem-wallet/'
    : '/',
  outputDir: 'docs',
  configureWebpack: {
    plugins: [new Dotenv()]
  }
}