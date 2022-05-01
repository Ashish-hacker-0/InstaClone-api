const express = require('express');
const app = express();

const config  = require('./config');
const db = require('./config/database');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const cors = (req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Method','*');
    res.header('Access-Control-Allow-Headers','*');
    next();
}

app.use(express.urlencoded({limit:'10mb',extended:true}));
app.use(express.json({limit:'10mb'}));
app.use(cors);
console.log(process.env.MONGO_URI);
app.get('/',function(err,res){
    res.send('Ok');
})
app.use('/user',userRouter);
app.use('/post',postRouter);

app.listen(config.port,console.log('Server has started at http://localhost:%s',config.port));