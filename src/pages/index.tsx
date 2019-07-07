import * as React from "react";
import { EmptyState, 
         Layout, 
         Page,
         Form,
         FormLayout,
         Tabs } from '@shopify/polaris';
//import RestProvider from '../providers/rest.provider';
import fetch from 'isomorphic-fetch';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export default class Index extends React.Component{
  constructor(props: any){
    super(props);

    this.state = {
      tab: 0,
      isEmpty: true,
      companyName: '',
      password: ''
    }

    this.companyExists();
  }

  public async companyExists(){
    fetch('https://3f128a1c.ngrok.io/store/exists/', {
      method: 'GET'
    }).then((res) =>{
      console.log(res);
    }, (err) =>{
      console.log(err);
    });
  }

  public createNewCompany(){
    //this.rp.createNewCompany()
    console.log("new company!");
  }

  handleTabChange = (idx) => {
    this.setState({tab: idx});
  };

  render(){
    const tabs = [{
      id: 'home-tab',
      content: 'Home'
    }, {
      id: 'manage-tab',
      content: 'Manage Gift Cards'
    }, {
      id: 'promo-tab',
      content: 'Manage Promotions'
    }, {
      id: 'account-tab',
      content: 'Account Settings'
    }];

    const c = {
      0: (<p>test 0</p>),
      1: (<p>test 1</p>),
      2: (<p>test 2</p>),
      3: (<p>test 3</p>)
    }

    const gifter_content = this.state.isEmpty ? (
      <EmptyState
        heading="Welcome to Shopify Gifter"
        action={{
          content: 'Setup Gifter',
          onAction: () => console.log('clicked'),
        }}
        image={img}
      >
        <p>Setup your business with Gifter for Shopify to start.</p>
        {/*<Form onSubmit={this.createNewCompany}>
          <FormLayout>
            <p>form here</p>
          </FormLayout>
        </Form>*/}
      </EmptyState>
    ) : (
      <Tabs tabs={tabs} selected={this.state.tab} onSelect={this.handleTabChange} fitted>
        {c[this.state.tab]}
      </Tabs>
    );

    return(
      <Page title="" fullWidth>
        <Layout>
          <Layout.Section>
            {gifter_content}
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
} 
