const nextCSS = require('@zeit/next-css');
const webpack = require('webpack');
const withTypescript = require('@zeit/next-typescript')

const apiKey =  JSON.stringify(process.env.API_KEY);
module.exports = nextCSS(withTypescript({
  webpack: (config) => {
    const env = { API_KEY: apiKey };

    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
  useFileSystemPublicRoutes: false,
  distDir: '_next'
}));