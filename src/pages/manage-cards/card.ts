import * as React from "react";
import {Icon} from '@shopify/polaris';
import PropTypes from "prop-types";
import "./card.css";

//icons
import {
  CirclePlusMinor
} from '@shopify/polaris-icons';

export class Card extends React.Component{
	constructor(props: any){
		super(props);

		this.state = {

		};
	}

	public createNewCard(){

	}

	render(){
		const content = this.props.default ? (
			<div className="cardContent" onClick={this.createNewCard}>
				<div>
					<Icon source={CirclePlusMinor} color="indigo" />
				</div>
				<div className="cardTextContainer">
					<p className="cardText">Create New Card</p>
				</div>
			</div>
		) : (
			<div className="cardContent">
				<div className="cardTextContainer">
					<p className="cardText">{this.props.name}</p>
					<p className="cardText">{this.props.value}</p>
				</div>
			</div>
		);

		return(
			<div className="cardContainerCSS">
				<div className="cardCSS">
					{content}
				</div>
			</div>
		);
	}
}

Card.propTypes = {
	default: PropTypes.bool,
	name: PropTypes.string,
	value: PropTypes.number
}