const express = require("express")
const router = express.Router()
const useApi = require("./user.api")
const authApi = require("./auth.api")

router.use('/user', useApi)
router.use('/auth', authApi)

module.exports = router