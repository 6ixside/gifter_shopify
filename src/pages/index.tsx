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
import { RestProvider } from '../providers/rest.provider';

//custom components imports
import { CreateCompanyModal } from './create-company/create-company';
import { ManageCardsPage } from './manage-cards/manage-cards';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export default class Index extends React.Component{
  public rp = new RestProvider();

  constructor(props: any){
    super(props);

    this.state = {
      tab: 0,
      create_modal_flag: false,
      isEmpty: true,
      companyName: '',
      password: ''
    }

    //check if the company exists
    this.rp.companyExists().then(res=>res.json()).then((res) =>{
      this.setState({isEmpty: !res.exists});
    }, (err) =>{
      console.log(err);
    });
  }

  handleTabChange = (idx: number) => {
    this.setState({tab: idx});
  }

  toggleCreateCompanyModal = () =>{
    this.setState({create_modal_flag: !this.state.create_modal_flag});
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
      1: (<ManageCardsPage />),
      2: (<p>test 2</p>),
      3: (<p>test 3</p>)
    }

    const create_modal_flag = this.state.create_modal_flag;
    const create_modal = (<CreateCompanyModal create_modal_flag={create_modal_flag} toggle={this.toggleCreateCompanyModal}/>);

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
