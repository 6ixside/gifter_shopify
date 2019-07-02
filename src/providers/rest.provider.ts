import { Component } from "react";

export default class RestProvider extends Component{
	constructor(props: any){
		super(props);
	}

	public async createNewCompany(name: String, password: String){
		fetch('https://aaf3149d.ngrok.io/w3/newCompany/', {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				password: password
			})
		}).then((res) =>{
			console.log(res);
		}, (err) =>{
			console.log(err);
		});
	}


}
