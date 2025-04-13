const router = require('express').Router()
const authController = require('../controllers/AuthController')
const userController = require('../controllers/UserController')

router.post('/auth/verify-otp', authController.verifyOtp)
router.post('/auth/send-otp', authController.sendVerificationEmail)
router.post('/auth/user/register', authController.registerUser)

router.get('/auth/user/get-all-users', userController.getAllUsers)
module.exports = router