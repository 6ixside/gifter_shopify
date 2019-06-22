import { Component } from "react"
import Web3 from 'web3';

export default class Web3Provider extends Component{
	/*sets the provider to the infura rinkeby node*/
	public web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/")); 
	
	constructor(props: any){
		super(props);
	}

	public async createNewCompany(){
		
	}


}
