import * as React from "react";
import { EmptyState, Layout, Page } from '@shopify/polaris';
import Web3Provider from '../providers/web3.provider';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export default class Index extends React.Component{
  constructor(props: any, public wp: Web3Provider){
    super(props);
  }

  public createNewCompany(){

  }

  render(){
    return(
      <Page title="">
        <Layout>
          <EmptyState
            heading="Welcome to Shopify Gifter"
            action={{
              content: 'Setup Gifter',
              onAction: () => console.log('clicked'),
            }}
            image={img}
          >
            <p>Setup your business with Gifter for Shopify to start.</p>
          </EmptyState>
        </Layout>
      </Page>
    );
  }
} 
