const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../../config/database');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    account_created:{
        type:String,
        default:Date.now()
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    profile:{
        type:String,
        default:null
    },
    bio:{
        type:String,
        default:''
    },
    dob:{
        type:String,
        default:''
    }
});

userSchema.index({'$**': 'text'});

userSchema.pre('save', function(next){
    let user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10,function(err,salt){

        if(err) return next(err);

        bcrypt.hash(user.password,salt, function(err,hash){
            if(err) return next(err);
            user.password= hash;
            next();
        })

    })
});

userSchema.methods.comparePassword = function(canditatePassword, cb) {
    bcrypt.compare(canditatePassword, this.password, function(err,isMatch){
        if(err) return cb(err);

        cb(null,isMatch);
    })
}



const userModel = mongoose.model('User',userSchema);




module.exports = userModel;