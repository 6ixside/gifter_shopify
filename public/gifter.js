console.log('setting up gifter!');

/* Load config and determine settings  */

/*Payload Types */
// GIFTER_INIT: message to initalize connection
// GIFTER_MESSAGE: simple gtreeting to check connectivity/ retrieve information
// GIFTER_PURCHASE: transfer information regarding a purchased giftercard to be added to the client (no actual data transfer)
// GIFTER_ERROR: Issue in communications between gifter client and webstore 

var payload = {
	type: "GIFTER_MESSAGE",
	
}

/* Attempt to poll gifter client */

/* If response, check configurations for appropriate workflow */

/* If workflow evaluates to targeted message, create popup according to config */
