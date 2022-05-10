import express from "express";
import pagesController from '../controllers/PagesController.js'
const router = express.Router()

router.use('/:id', pagesController.getById)
router.use('/', pagesController.getAll)


export default router