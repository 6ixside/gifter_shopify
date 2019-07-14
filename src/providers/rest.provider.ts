import * as React from "react";
import fetch from 'isomorphic-fetch';

export class RestProvider extends React.Component{
	public companyExists(){
		return new Promise((resolve, reject) =>{
			fetch('https://998c6b95.ngrok.io/store/exists/', {
				method: 'GET'
			}).then((res) =>{
				resolve(res);
			}, (err) =>{
				reject(err);
			});
		});
	}

	public createNewCompany(name: String, password: String){
		return new Promise((resolve, reject) =>{
			fetch('https://998c6b95.ngrok.io/w3/newCompany/', {
				method: 'POST',
				credentials: "include",
				body: JSON.stringify({
					name: name,
					password: password
				}),
				headers: {'Content-Type': 'application/json'}
			}).then((res) =>{
				resolve(res);
			}, (err) =>{
				reject(err);
			});
		});
	}
}