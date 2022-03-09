import express from 'express'

import userController from '../controller/usersController'

const router = express.Router()


router.use("/api/user/",userController);

module.exports = router;