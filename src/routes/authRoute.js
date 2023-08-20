const express = require('express')
const { register, login, changePassword } = require('../services/authService')
const router = express.Router()
const {registerValidator, loginValidator} =require('../validator/authValidator')

router.post('/register', registerValidator, register)
router.post('/login', loginValidator, login)
router.post('/changePassword', changePassword)



module.exports = router