const model = require('./model');
const jwt = require('jsonwebtoken');
const userModel = require('../user/model');
const { default: mongoose } = require('mongoose');

module.exports = {
    newpost: (req,res) => {
        console.log(req);
        let user_id = jwt.decode(req.body.auth_token).id;

        userModel.findById(user_id)
          .then(result=>{
              console.log(result);
              if(!result){
                  res.send({success:false, msg:  "No user found!"});
                  return;
              }
              let profile = result.profile==null?'':result.profile;
              let newPost = new model({
                  user_id:user_id,
                  username:result.username,
                  post:req.file.path,
                  desc:req.body.desc,
                  type:'Image',
              });
              console.log('newpost',newPost);
              newPost.save()
              .then(result=>{
                  console.log(result);
                  res.send({success:true, result:result});
              })
              .catch(err=>{
                  if(err) res.send({success:false, error:err});
              })
          })
    },
    newreel: (req,res) => {
        console.log(req);
        let user_id = jwt.decode(req.body.auth_token).id;
        console.log(user_id);
        userModel.findById(user_id)
          .then(result=>{
              console.log(result);
              if(!result){
                  res.send({success:false, msg:  "No user found!"});
                  return;
              }
              let profile = result.profile==null?'':result.profile;
              let newPost = new model({
                  user_id:user_id,
                  username:result.username,
                  image:result.profile,
                  post:req.body.path,
                  desc:req.body.desc,
                  type:'Reel',
                  image:profile
              });
              newPost.save()
              .then(result=>{
                  console.log(result);
                  res.send({success:true, result:result});
              })
              .catch(err=>{
                  if(err) res.send({success:false, error:err});
              })
          })
    },
    getPosts: (req,res) => {
        model.find()
        .then(result=>{
            res.send(result.reverse());
        })
    },
    getFriendsPost: (req,res)=>{
        console.log(req.headers);
        let user_id = jwt.decode(req.headers.authorization.split(" ")[1]).id;

        userModel.findById(user_id)
        .then(result=>{
            console.log('result',result);
            if(!result){

                res.send({success:false, msg:'No user found'});
                return;
            }
            if(result.following.length==0){
                res.send({success:true,data:[]});
                return;
            }
            model.find({user_id:{$in:result.following.map(i=>i.id)}})
            .then(post=>{
                if(!post){
                    res.send({success:true,data:[]});
                    return;
                }
                res.send({success:true,data:post.reverse()});
            })
            .catch(err=>{
                res.send({success:false});
            })  
        })
        .catch(err=>{
            res.send({success:false});
        })
    },
    getreel:(req,res)=>{
        model.find({type:'Reel'})
        .sort({timestap:-1})
        .limit(10)
        .then((result)=>{
            res.send(result);
        })
    },
    like:(req,res) => {
        let user_id = jwt.decode(req.body.auth_token).id;

        userModel.findById(user_id)
        .then(result=>{
            console.log('result',result);
            if(!result){

                res.send({success:false, msg:'No user found'});
                return;
            }
            model.findByIdAndUpdate(req.body.id,{$push:{likes:{username:result.username,image:result.profile}}})
            .then(comment=>{
                console.log(comment);
                res.send({success:true});
            })
            .catch(err=>{
                res.send({success:false});
            })
        })
    },
    unlike:(req,res) => {
        let user_id = jwt.decode(req.body.auth_token).id;

        userModel.findById(user_id)
        .then(result=>{
            console.log('result',result);
            if(!result){
                res.send({success:false, msg:'No user found'});
                return;
            }
            model.findByIdAndUpdate(req.body.id,{$pull:{likes:{username:result.username,image:result.profile}}})
            .then(comment=>{
                res.send({success:true});
            })
            .catch(err=>{
                res.send({success:false});
            })
        })
    },
    comment:(req,res) => {
        let user_id = jwt.decode(req.body.auth_token).id;

        userModel.findById(user_id)
        .then(result=>{
            console.log('result',result);
            if(!result){

                res.send({success:false, msg:'No user found'});
                return;
            }
            model.findByIdAndUpdate(req.body.id,{$push:{comments:{username:result.username,image:result.profile,comment:req.body.comment}}})
            .then(comment=>{
                console.log(comment);
                res.send({success:true,comment:{username:result.username,image:result.profile,comment:req.body.comment}});
            })
            .catch(err=>{
                res.send({success:false});
            })
        })
    }
}