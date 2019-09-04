//change button to input field, for dev just auto redeem
function openRedeem(){
	
}

//pretty much only used to get cart token
async function getCartInfo(){
	$.ajax({
		url: '/cart.js/',
		dataType: 'json'
	}).then((cart) =>{
		window.gifter.cart = cart;
	}, (err) =>{console.log(err);});
}

//add the redeem button
function appendRedeem(){
	let redeemModal = `<style>
											.redeem-modal{
											    display: none; /* Hidden by default */
											    position: fixed; /* Stay in place */
											    z-index: 999; /* Sit on top */
											    left: 0;
											    top: 100px;
											    width: 100%; /* Full width */
											    height: 100%; /* Full height */
											    overflow: auto; /* Enable scroll if needed */
											    background-color: rgba(0,0,0,0.5); /* Black w/ opacity */
											}

											.redeem-content {
											    position: relative;
											    background-color: transparent;
											    margin: auto;
											    padding: 0;
											    width: 50%;  
											    -webkit-animation-name: animatetop;
											    -webkit-animation-duration: 0.4s;
											    animation-name: animatetop;
											    animation-duration: 0.4s
											}

											.redeem-header {
											    padding: 2px 16px;
											    /*background-color: #5cb85c;*/
											    color: white;
											}

											.redeem-form-container{
												background-color: #FFFFFF;
											}
										</style>

										<div class="redeem-modal">
											<div class="redeem-content">
												<div class="redeem-header">
													<span class="close">&times;</span>

												</div>
												
												<div class="redeem-form-container">
													<form class="redeem-form" action="https://49ab0e8a.ngrok.io/w3/redeem-card" method="post">
														Code: <input type="text" name="code" />
														<input type="submit" value="Submit">
													</form>
												</div>
											</div>
										</div>`;

	let redeemButton = `
		<input name="enter_gift_card" type="button" class="btn btn--secondary small--hide cart__submit-control gifter-redeem" value="Redeem Gift Card"/>
	`;

	let redeemContainer = document.createElement('div');
	redeemContainer.classList.add('redeemContainer');
	redeemContainer.innerHTML = redeemModal;

	$('body').append(redeemContainer);
	$('div.cart__submit-controls').prepend(redeemButton);

	var $rModal = $('.redeem-modal');
	var $rForm = $('form.redeem-form');

	$rForm.submit((e) =>{
		e.preventDefault();

		let data = {}
		$.each($rForm.serializeArray(), function(i, f) {
		  data[f.name] = f.value;
		});

		console.log(data);

		$.ajax({
			url: 'https://d4b99d50.ngrok.io/w3/redeem-card',
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			dataType: 'json'
		})
	});

	$('input.btn.gifter-redeem').click(() =>{
		console.log("opening");
		$rModal.css('display', 'block');
	});

	$('span.close').click(() =>{
		console.log('closing');
		$rModal.css('display', 'none');
	});
}

//main
(() =>{
	window.gifter = window.gifter ? window.gifter : {};

	let page = {
		isCart: /^\/(cart)/.test(window.location.pathname)
	};

	if(page.isCart)
		getCartInfo();
		appendRedeem();
})();