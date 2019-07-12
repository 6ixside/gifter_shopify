const MongoClient = require('mongodb').MongoClient;
const db_pass = process.env.DB_PASS;
const uri = "mongodb+srv://gifter_shopify:" + db_pass + "@gifter-shopify-dev-itn9j.gcp.mongodb.net/test?retryWrites=true&w=majority";
const db_name = 'shopify'

module.exports = class MongoConnector{
	constructor(opts={}){
		this.client = new MongoClient(uri, { useNewUrlParser: true });
		this.client.connect().then((client) =>{
			console.log("mongodb connected!");

			this.client = client;
			this.db = this.client.db(db_name);


		}, (err)=>{
			console.log(err);
		});
	}

	close(force = false){
		this.client.close(force).then(() =>{
			console.log("connection has been closed");
		})
	}

}