import * as React from "react";
import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import Cookies from 'js-cookie';
import { Provider } from '@shopify/app-bridge-react';

class GifterApp extends App {
  state = {
    shopOrigin: Cookies.get('shopOrigin'),
  }

  render() {
    console.log(Cookies.get('shopOrigin'));
    const { Component, pageProps } = this.props;
    const config = {apiKey: process.env.API_KEY ? process.env.API_KEY : '', shopOrigin: this.state.shopOrigin ? this.state.shopOrigin : ''};

    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
        </Head>
        {/*<Provider config={config}>
          <Component {...pageProps} />
        </Provider>*/}

        <AppProvider
          forceRedirect
          >
          <Provider config={config}>
            <Component {...pageProps} />
          </Provider>
        </AppProvider>
      </React.Fragment>
    );
  }
}

export default GifterApp;