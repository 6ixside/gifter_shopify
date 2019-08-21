//change button to input field, for dev just auto redeem
function openRedeem(){

}

//add the redeem button
function appendRedeem(){
	let redeemButton = `
		<input name="enter_gift_card" type="button" class="btn btn--secondary small--hide cart__submit-control gifter-redeem" value="Redeem Gift Card"/>
	`;

	$('div.cart__submit-controls').prepend(redeemButton);
	$('input.btn.gifter-redeem').click(openRedeem);
}

//main
(() =>{
	let page = {
		isCart: /^\/(cart)/.test(window.location.pathname)
	};

	if(page.isCart)
		appendRedeem();
})();