const model = require('./model');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const postModel = require('../post/model');
module.exports = {
    login: (req,res) => {
        model.findOne({email:req.body.email}, (err,user)=>{
            if(err) throw err;
            if(!user) {
                res.send({auth:false,msg: "User not found"});
                return;
            }
            user.comparePassword(req.body.password,(err,isMatch)=>{
                if(err) throw err;

                if(isMatch) {
                    let token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400});
                    res.status(200).send({auth:true, token,username:user.username});   
                }else{
                    res.status(200).send({auth:false,msg:'Password mismatch'});
                }
            })
        })
    },
    register: (req,res) => {
        let newUser = new model({
            name:req.body.name,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            dob:req.body.dob
        });
        newUser.save()
        .then(result => {
            console.log(result);
            let token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400});
            res.status(200).send({auth:true, token});
        })
        .catch(e=>{
            console.log(e);
            res.status(200).send({auth:false,msg:'Register UnSuccessful',error:e});
        })
    },
    getProfile : (req,res) => {
        let user_id = jwt.decode(req.headers.authorization.split(" ")[1]).id;
        model.findById(user_id)
        .then(user=> {
            if(!user) {
                res.send({success: false, msg: "User not found"});
                return;
            }

            postModel.find({user_id:user_id})
            .then(posts=>{
                res.send({
                    success:true,
                    details: {
                        username:user.username,
                        posts:posts.reverse(),
                        followers:user.followers,
                        following:user.following,
                        bio:user.bio,
                        profile:user.profile,
                        name:user.name
                    }
                })
            })

        })
    },
    isUser : (req,res) => {
        console.log(req.body);
        model.findOne({email:req.body.email})
        .then(user=>{
            console.log(user);
            if(user){
                res.send({success:true});
                return;
            }
            res.send({success:false});
        })
        .catch(err=>{
            res.send({err:true});
        })
    },
    checkUsername : (req,res) => {
        model.findOne({username:req.body.username})
        .then(user=>{
            console.log(user);
            if(user){
                res.send({success:true});
                return;
            }
            res.send({success:false});
        })
        .catch(err=>{
            res.send({err:true});
        })
    },
    searchUser: (req,res) => {
        console.log(req);
        model.find({$text:{$search:req.body.query}},{name:1,username:1,profile:1})
        .limit(10)
        .then(result=>{
            if(result){
                res.send({success:true,result:result})
            }else{
                res.send({success:false})
            }
        })
        .catch(err=>{
            res.send({success:false});
        })
    },
    getUserProfile: (req,res) => {
        model.findOne({username:req.body.username},{name:1,username:1,followers:1,following:1,profile:1,bio:1,_id:1})
        .then(result=>{
            if(result){
                postModel.find({user_id:result._id})
                .then(posts=>{
                    res.send({
                        success:true,
                        user:result,
                        posts:posts.reverse()
                    })
                })
                .catch(err=>{
                    res.send({
                        success:true,
                        user:res,
                        posts:[]
                    })
                })
            }else{
                res.send({success:false});
            }
        })
        .catch(err=>{
            res.send({success:false});
        })
    },
    follow: (req,res) => {
        console.log(req.body);
        let user_id = jwt.decode(req.body.auth_token).id;
        console.log(user_id);
        model.findById(user_id)
        .then(async(user)=> {

            if(user){
                await model.findOneAndUpdate({username:req.body.username},{$push:{followers:{name:user.name,image:user.image,username:user.username}}});
                model.findByIdAndUpdate(user._id,{$push:{following:{name:req.body.name,username:req.body.username,image:req.body.image,id:req.body.id}}})
                .then(result=>{
                    console.log(result);
                    res.send({success:true});
                })
                .catch((err)=>{
                    res.send({success:false});
                })
            }else{
                res.send({success:false});
            }
        })
        .catch(err=>{
            res.send({success:false});
        })
    },
    unfollow: (req,res) => {
        let user_id = jwt.decode(req.body.auth_token).id;
        console.log(user_id);
        model.findById(user_id)
        .then(async(user)=> {

            if(user){
                await model.findOneAndUpdate({username:req.body.username},{$pull:{followers:{name:user.name,image:user.image,username:user.username}}});
                model.findByIdAndUpdate(user._id,{$pull:{following:{name:req.body.name,username:req.body.username,image:req.body.image,id:req.body.id}}})
                .then(result=>{
                    console.log(result);
                    res.send({success:true});
                })
                .catch((err)=>{
                    res.send({success:false});
                })
            }else{
                res.send({success:false});
            }
        })
        .catch(err=>{
            res.send({success:false});
        })
    }
};