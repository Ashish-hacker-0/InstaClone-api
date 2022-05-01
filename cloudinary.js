const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'post',
        allowedFormats: ['jpeg', 'png', 'jfif', 'jpg']
    }
})
const storage2 = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'reels',
        allowedFormats: ['mp4', 'webm', 'ogg']
    }
})

module.exports = {
    storage,
    storage2,
    cloudinary

}