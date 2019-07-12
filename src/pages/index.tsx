import * as React from "react";
import { EmptyState, 
         Layout, 
         Page,
         Form,
         FormLayout,
         Tabs,
         Modal,
         Stack,
         TextField } from '@shopify/polaris';
//import RestProvider from '../providers/rest.provider';
import fetch from 'isomorphic-fetch';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export default class Index extends React.Component{
  constructor(props: any){
    super(props);

    this.state = {
      tab: 0,
      create_modal_flag: false,
      isEmpty: true,
      companyName: '',
      password: ''
    }

    this.companyExists();
  }

  public async companyExists(){
    fetch('https://ef87858d.ngrok.io/store/exists/', {
      method: 'GET'
    }).then(res => res.json()).then((res) =>{
      console.log(res.exists);
      this.setState({isEmpty: !res.exists});
    }, (err) =>{
      console.log(err);
    });
  }

  public async createNewCompany(e){
    console.log("creating new company");
    console.log(e);
    /*fetch('https://ef87858d.ngrok.io/w3/newCompany/', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        password: password
      })
    }).then((res) =>{
      console.log(res);
    }, (err) =>{
      console.log(err);
    });*/
  }

  handleTabChange = (idx: number) => {
    this.setState({tab: idx});
  }

  toggleCreateCompanyModal = () =>{
    this.setState({create_modal_flag: !this.state.create_modal_flag});
    console.log(this.state.create_modal_flag);
  }

  closeCreateCompanyModal = () =>{
    console.log("closing tab");
  }

  render(){
    //define tabs
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

    //temporary content
    const c = {
      0: (<p>test 0</p>),
      1: (<p>test 1</p>),
      2: (<p>test 2</p>),
      3: (<p>test 3</p>)
    }

    const create_modal_flag = this.state.create_modal_flag;
    var name = '';
    var password = '';
    const create_modal = (
      <Modal
        open={create_modal_flag}
        onClose={this.toggleCreateCompanyModal}
        title="create new company"
        primaryAction={{
          content: 'Create New Company',
          onAction: this.toggleCreateCompanyModal,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: this.toggleCreateCompanyModal,
          },
        ]}>
        <Modal.Section>
          <Stack vertical>
            <Form onSubmit={this.createNewCompany}>
              <TextField
                value={name}
                onChange={()=>{}}
                label="name"
                helpText={<span>This is the name that your company will be known as on the blockchain</span>}
              />

              <TextField
                value={password}
                onChange={()=>{}}
                label="password"
                type="password"
                helpText={<span>enter a secret to encrypt your blockchain account</span>}
              />
            </Form>
          </Stack>
        </Modal.Section>
    </Modal>
    );

    const gifter_content = this.state.isEmpty ? (
      <EmptyState
        heading="Welcome to Shopify Gifter"
        action={{
          content: 'Setup Gifter',
          onAction: () => this.toggleCreateCompanyModal(),
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
            {create_modal}
            {gifter_content}
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
} 
