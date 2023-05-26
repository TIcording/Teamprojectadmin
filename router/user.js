import express from "express";
import * as userController from '../controller/user.js'


const router = express.Router(); // Router를 설정할때 중요


// GET
router.get('/', userController.getUser); // 회원 정보 가져오기

// PUT
router.put('/:id', userController.updateUser) // 회원 정보 갱신

// PUT
// 탈퇴 여부
router.put('/out/:id', userController.secession) // 탈퇴 회원 설정

export default router; // 마찬가지로 router를 export하기 위해 무조건적으로 넣어야 한다.