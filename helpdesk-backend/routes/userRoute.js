const express = require('express');
const router = express.Router();

const { getUserProfile, updateUserProfile, changePassword, uploadProfileImage } = require('../controllers/userController');

const upload = require('../middleware/uploadProfilePic');



router.get('getProfile', getUserProfile);
router.put('updateProfile', updateUserProfile);
router.post('/change-password', changePassword);
router.post('profile-image', upload.single('profileImage'), uploadProfileImage);

module.exports = router;
