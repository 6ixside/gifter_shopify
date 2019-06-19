const nextCSS = require('@zeit/next-css');
const webpack = require('webpack');

const apiKey =  JSON.stringify(process.env.API_KEY);
module.exports = nextCSS({
  webpack: (config) => {
    const env = { API_KEY: apiKey };

    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
  useFileSystemPublicRoutes: false,
  distDir: '_next'
});