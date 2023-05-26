import express from "express";
import * as FAQcontroller from '../controller/FAQ.js'

const router = express.Router();

//POST
router.post('/', FAQcontroller.sendFAQ) // FAQ 보내기

export default router;