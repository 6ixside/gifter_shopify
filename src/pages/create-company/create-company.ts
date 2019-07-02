import * as React from "react";

const CreateCompanyTemplate = require('./create-company.tsx');

export default class CreateCompanyModal extends React.Component{
	constructor(props: any){
		super(props);
	}

	render(){
		return(
			<CreateCompanyTemplate />
		)
	}
}