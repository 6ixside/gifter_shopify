import * as React from "react";
import {Form,
        Modal,
        Stack,
        TextField} from '@shopify/polaris';

import { RestProvider } from '../../providers/rest.provider';

export class CreateCompanyModal extends React.Component{
	public rp = new RestProvider();

	constructor(props: any){
    super(props);

    this.state = {
    	create_modal_flag: true,
      company_name: '',
      password: ''
    }
  }

  public async createNewCompany(){
  	this.rp.createNewCompany(
  		this.state.company_name,
  		this.state.password
  	).then((res) =>{
  		// response here is just status
  		console.log(res);
  	}, (err) =>{
  		// error will be if company is not created for some reason
  		console.log(err);
  	});
  }

  public handleFormChange(field){
  	return (value) => this.setState({[field]: value});
  }

	render(){
		var { create_modal_flag, toggle } = this.props;
		var {company_name, password} = this.state;

		//there is probably a better way but i'm dumb lol
		var saveAndClose = () =>{
			this.createNewCompany();
			toggle();
		}

		return(
			<Modal
        open={create_modal_flag}
        onClose={toggle}
        title="Setup Your Company"
        primaryAction={{
          content: 'Save',
          onAction: saveAndClose,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: toggle,
          },
        ]}>
        <Modal.Section>
          <Stack vertical>
            <Form onSubmit={this.createNewCompany}>
              <TextField
                value={company_name}
                onChange={this.handleFormChange("company_name")}
                label="Name"
                helpText={<span>This is the name that your company will be known as on the blockchain</span>}
              />

              <TextField
                value={password}
                onChange={this.handleFormChange("password")}
                label="Password"
                type="password"
                helpText={<span>Enter a secret password to encrypt your account</span>}
              />
            </Form>
          </Stack>
        </Modal.Section>
    	</Modal>
		)
	}
}