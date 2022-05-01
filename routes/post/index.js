const router = require('express').Router();
const controller = require('./controller');
const multer = require('multer');
const {storage,storage2} = require('../../cloudinary');

const photo = multer({
    storage:storage
});


router.post('/newpost',photo.single('image'),controller.newpost);
router.post('/newreel',controller.newreel);
router.get('/getpost',controller.getPosts);
router.get('/getFriendPost',controller.getFriendsPost);
router.get('/getreel',controller.getreel);
router.post('/like',controller.like);
router.post('/unlike',controller.unlike);
router.post('/comment',controller.comment);

module.exports = router;