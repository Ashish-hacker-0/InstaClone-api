const router = require('express').Router();
const controller = require('./controller');

router.post('/login',controller.login);
router.post('/register',controller.register);
router.get('/getProfile',controller.getProfile);
router.post('/isUser',controller.isUser);
router.post('/usernameAvai',controller.checkUsername);
router.post('/searchuser',controller.searchUser);
router.post('/getProfile',controller.getUserProfile);
router.post('/follow',controller.follow);
router.post('/unfollow',controller.unfollow);


module.exports = router;