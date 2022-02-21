const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
 dbNAme='nodeproject'
const dbUrl=`mongodb+srv://Raghul:raghul@raghul.9mka0.mongodb.net/${dbNAme}`
module.exports={dbUrl,mongodb,MongoClient,dbNAme}
