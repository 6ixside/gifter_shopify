import * as React from "react";
import { Page } from '@shopify/polaris';

import { RestProvider } from '../../providers/rest.provider';
import { Card } from './card';
import { CreateCardModal } from './create-modal';

export class ManageCardsPage extends React.Component{
  public rp = new RestProvider();

	constructor(props: any){
    super(props);

    this.state = {
      data: [{
        name: 'test',
        val: 25
      }, {
        name: 'test2',
        val: 50
      }],
      create_modal_flag: false
    }

    /*this.rp.getCards().then((data) =>{
      this.setState({'data': data});
    });*/
  }

  toggleCreateCardModal = () =>{
    this.setState({create_modal_flag: !this.state.create_modal_flag});
  }

	render(){
    var cards = this.state.data.map((card) =>{
      return(
        <Card key={card.name} name={card.name} value={card.val}/>
      )
    });

		return(
		  <Page fullWidth>
        <CreateCardModal create_modal_flag={this.state.create_modal_flag} toggle={this.toggleCreateCardModal} />
        <Card key={'default'} name={'default'} value={-1} toggle={this.toggleCreateCardModal} default></Card>

        {cards}
      </Page>	
    );
	}
}