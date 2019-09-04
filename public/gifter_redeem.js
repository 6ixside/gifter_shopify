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
	let redeemModal = `
	<style>
    .redeem-modal{
        display: block; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 999; /* Sit on top */
        left: 0;
        top: 100px;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgba(255,255,255,1); /* Black w/ opacity */
            font-family: "Work Sans",sans-serif;
    }
    .redeem-content {
        position: relative;
        background-color: white;
        margin: auto;
        padding: 0;
        width: 50%;
             border-radius: 15px 15px 15px 15px;
        -webkit-animation-name: animatetop;
        -webkit-animation-duration: 0.4s;
        animation-name: animatetop;
        animation-duration: 0.4s;
            border: 5px #3d4246 solid;
    }
    .redeem-header {
        padding: 2px 95%;
        /*background-color: #5cb85c;*/
        color: white;
        font-size: 40px;
    }
    .redeem-form-container{
        background-color: white;
    }
    .redeem-form-container-submit{
        margin-top: 75px;
    justify-content: center;
    width: 100%;
    display: flex;
        color: #3d4246;
    }
    .redeem-form{
            margin-top: 35px;
            justify-content: center;
            color: #3d4246;
    }
    .redeem-title{
        display: inline;
        padding: 0% 17%;
        font-size: 40px;
        color: #3d4246;
    }
    .close{
        padding: 0% 17%;
        font-size: 40px;
    }
    .download-link{
        padding-left:55px;
        color: #3d4246;
        font-size: 15px;
    }
    .code-area{
        width: 100%;
    display: flex;
    justify-content: center;
    }
    .button{
        background: white;
        border: 1px solid black;
        border-radius: 7px;
    }
    .button:hover{
        background-color: #3d4246;
        color: white;
    }
    .successful-redeem{
        color: limegreen;
        border: 2px solid limegreen;
        margin-left:10px;
        padding: 4px 4px;
        text-align: center;
        height: 14px;
        display:flex;
        align-items: center;
        justify-content: center;
      /* display: none; */
    }
        .failed-redeem{
            color: red;
            border: 2px solid red;
            margin-left:10px;
            padding: 4px 4px;
            text-align: center;
            height: 14px;
            width: 25%;
            border-radius: 15px 15px 15px 15px;
            display: flex;
            align-items: center;
            justify-content: center;
             /* display: none; */
    }
    .input-box{
        height: 24px;
    }
</style>
<div class="redeem-modal">
    <div class="redeem-content">
        <div class="redeem-header">
            <span class="close">&times;</span>
        </div>
            <div>
                <p class="redeem-title"> Redeem Your Card </p>
            </div>
                <div class="redeem-form-container">
                    <form class="redeem-form" action="https://435383d1.ngrok.io/w3/redeem-card" method="post">
                        <div class="code-area">
                            <label>Code:</label>
                            <input class="input-box" type="text" name="code" />
                            <div class="successful-redeem"> Redeemed =&#10004 </div>
                            <div class="failed-redeem"> Invalid Code &#10008 </div>
                        </div>
                        <div class="redeem-form-container-submit">
                            <input class="button" type="submit" value="submit">
                    </form>
                        </div>
                </div>
                <span
                class="download-link"> Tired of keeping your gift cards in your email? Click <a href="http://www.gifterextension.com">here!</a>
            </span>
            </div>
`;

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