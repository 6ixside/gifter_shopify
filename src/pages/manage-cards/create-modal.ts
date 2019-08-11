import * as React from "react";
import {Form,
        Modal,
        Caption,
        Stack,
        TextField,
        Thumbnail,
        DropZone} from '@shopify/polaris';

import { RestProvider } from '../../providers/rest.provider';

export class CreateCardModal extends React.Component{
  public rp = new RestProvider();

	constructor(props: any){
		super(props);

		this.state = {
			create_modal_flag: true,
      card_name: '',
      card_value: 1,
      card_description: '',
      card_image: null
		}
	}

	//need to think on how to do this still
	public async createNewCard(){
    this.rp.createNewCard(
      this.state.card_name,
      this.state.card_value,
      this.state.card_description
    ).then((res) =>{
      console.log(res);
    });
	}

  public handleFormChange(field){
    return (value) => this.setState({[field]: value});
  }

	render(){
		const { create_modal_flag, toggle } = this.props;
    const { card_name, card_value, card_description, card_image } = this.state;

    const upload = card_image && (
      <Stack vertical>
        <Stack alignment="center" >
          <Thumbnail
            size="small"
            alt={card_image.name}
            source={window.URL.createObjectURL(card_image)}
          />
          <div>
            {card_image.name} <Caption>{card_image.size} bytes</Caption>
          </div>
        </Stack>
      </Stack>
    );

		let saveAndClose = () =>{
			this.createNewCard();
			toggle();
		}

		return(
			<Modal
				open={create_modal_flag}
        onClose={toggle}
        title="Create a New Card"
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
                value={card_name}
                onChange={this.handleFormChange("card_name")}
                label="Card Name"
                helpText={<span>This is a name you can use to refer to the card</span>}
              />

              <TextField
                value={card_value}
                onChange={this.handleFormChange("card_value")}
                label="Card Value"
                type="number"
                min="1"
                max="1000"
                helpText={<span>Enter how much this gift card is worth</span>}
              />

              <TextField
                value={card_description}
                onChange={this.handleFormChange("card_description")}
                label="Card Description"
                type="textarea"
                helpText={<span>Enter a short description for this gift card</span>}
              />

              {/* TODO
                <DropZone
                accept="image/*"
                type="image"
                errorOverlayText="File type must be an image"
                onDrop={(files, acceptedFiles, rejectedFiles) => {
                  this.setState({
                    card_image: acceptedFiles,
                  });
                }}
              />*/}
            </Form>
          </Stack>
        </Modal.Section>
			</Modal>
		);
	}
}