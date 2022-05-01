const mongoose = require('mongoose');
const config = require('./index');
require('dotenv').config()
console.log(process.env)

const db = mongoose.connect(config.mongo_uri,{useNewUrlParser:true})
.then(()=>console.log('Connect to database'))
.catch(err=>console.log('An Error occured',err));

//byxkkLoJ12CInH1A
module.exports = db;