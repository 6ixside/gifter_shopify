import * as React from "react";

const CreateCompanyTemplate = require('./create-company.tsx');

export default class CreateCompanyModal extends React.Component{
	state = {
		active: true,
		
	};

	render(){
		return(
			<CreateCompanyTemplate />
		)
	}
}