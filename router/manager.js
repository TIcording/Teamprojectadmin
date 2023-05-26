import express from "express";
import * as managerController from '../controller/manager.js'

const router = express.Router();

//POST
router.post('/signup', managerController.signup) // 회원가입 주소

// POST
router.post('/login', managerController.login); // 로그인 주소

export default router;