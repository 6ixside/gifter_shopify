const nextCSS = require('@zeit/next-css');
const webpack = require('webpack');
const withTypescript = require('@zeit/next-typescript')

const apiSecret = JSON.stringify(process.env.API_SECRET);
const apiKey =  JSON.stringify(process.env.API_KEY);
const ngrok = JSON.stringify(process.env.NGROK);

module.exports = nextCSS(withTypescript({
  webpack: (config) => {
    const env = { 
    	API_SECRET: apiSecret,
    	API_KEY: apiKey,
    	NGROK:  ngrok
    };

    config.plugins.push(new webpack.EnvironmentPlugin(env));
    return config;
  },
  useFileSystemPublicRoutes: false,
  distDir: '_next'
}));