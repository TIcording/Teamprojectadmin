import express from "express";
import * as requestController from '../controller/request.js'

const router = express.Router();

//GET
router.get('/', requestController.getRequest) // 모든 문의 받기

//PUT
router.put('/:id', requestController.answerRequest) // 문의에 답하기

//GET
router.get('/no', requestController.getRequest_noAnswer) // 답변이 완료 되지 않은 문의 받기

export default router;