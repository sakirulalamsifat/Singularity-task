import express from 'express'

import articleController from '../controller/articleController'

const router = express.Router()


router.use("/api/article/",articleController);

module.exports = router;