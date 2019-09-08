var crypto = require('crypto');
let generatedHash = crypto.createHash('sha256').update("UhjuXAcLTByGFVQyuOYC" + "gifter-stg.myshopify.com").digest('hex').substr(0, 32);
console.log(generatedHash);