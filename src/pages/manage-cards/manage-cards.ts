import * as React from "react";
import { Page } from '@shopify/polaris';

import { RestProvider } from '../../providers/rest.provider';
import { Card } from './card';

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
      }]
    }

    /*this.rp.getCards().then((data) =>{
      this.setState({'data': data});
    });*/
  }

	render(){
    var cards = this.state.data.map((card) =>{
      return(
        <Card key={card.name} name={card.name} value={card.val}/>
      )
    });

		return(
		  <Page fullWidth>
        <Card key={'default'} name={'default'} value={-1} default></Card>

        {cards}
      </Page>	
    );
	}
}