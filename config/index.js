require('dotenv').config();
module.exports = {
    port:process.env.PORT || 3000,
    mongo_uri:process.env.MONGO_URI,
    secret:process.env.SECRET
};