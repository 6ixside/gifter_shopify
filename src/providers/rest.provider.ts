import * as React from "react";
import fetch from 'isomorphic-fetch';

export class RestProvider extends React.Component{
	public companyExists(){
		return new Promise((resolve, reject) =>{
			fetch(process.env.NGROK + '/store/exists/', {
				method: 'GET'
			}).then((res) =>{
				resolve(res);
			}, (err) =>{
				console.log("exists error");
				reject(err);
			});
		});
	}

	public createNewCompany(name: String, password: String){
		return new Promise((resolve, reject) =>{
			fetch(process.env.NGROK + '/w3/newCompany/', {
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

	public createNewCard(title: String, value: String, desc: String){
		return new Promise((resolve, reject) =>{
			fetch(process.env.NGROK + '/w3/newCard', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					title: title,
					value: value,
					desc: desc
				})
			}).then((res) =>{
				resolve(res);
			}, (err) =>{
				reject(err);
			});
		});
	}
}