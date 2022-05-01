const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const db = require('../../config/database');

const postSchema = Schema({
    user_id:{
        type:ObjectId,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    post:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:false
    },
    timestap: {
        type: String,
        default:Date.now()
    },
    likes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    },
    type:{
        type:String,
        required:true
    }
})

const model = mongoose.model('post',postSchema);

module.exports = model;