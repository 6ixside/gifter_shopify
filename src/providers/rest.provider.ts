import * as React from "react";

export default class RestProvider extends React.Component{
	constructor(props: any){
		super(props);
	}

	public async companyExists(){
		fetch('https://27228889.ngrok.io/store/exists/', {
			method: 'GET'
		}).then((res) =>{
			console.log(res);
		}, (err) =>{
			console.log(err);
		});
	}

	public async createNewCompany(name: String, password: String){
		fetch('https://27228889.ngrok.io/w3/newCompany/', {
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