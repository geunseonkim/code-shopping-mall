const express = require("express")
const router = express.Router()
const useApi = require("./user.api")

router.use('/user', useApi)

module.exports = router