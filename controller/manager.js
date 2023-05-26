import * as managerRepository from "../data/manager.js"
import jwt from 'jsonwebtoken';
import {config} from "../config.js";
import bcrypt from "bcrypt"

export async function signup(req, res) {
    const {mi_userid, mi_password, mi_name, mi_hp,mi_department }  = req.body;
    const found = await managerRepository.searchUserId(mi_userid); // mi_userid가 이미 있는지 확인
    if (found) {
        return res.status(409).json({ message: `${mi_userid}은 이미 가입되었습니다`}) // 있을 경우 message를 보낸다.
    }
    const hashed = await(bcrypt.hash(mi_password, config.bcrypt.saltRounds)); // 없을 경우 mi_password를 bcrypt를 이용하여 보안을 걸어놓는다.
    const userId = await(managerRepository.createUser({ // 보안을 걸어놓은 비밀번호까지 해서 회원가입 진행
        mi_userid,
        mi_password: hashed,
        mi_name,
        mi_hp,
        mi_department
    }));
    
    const token = createJwtToken(userId); // 토큰 생성
    res.status(201).json({token, mi_userid}); // 회원가입 결과로는 토큰과 mi_userid를 보낸다.
}


export async function login(req, res) {
    const {mi_userid, mi_password} = req.body; //로그인을 할 때 postman의 body에서 입력한 mi_userid, mi_password를 각각 할당한다.
    const user = await(managerRepository.searchUserId(mi_userid)); // 회원가입이 되어 있는지 확인
    console.log(user)
    // console.log(user);
    console.log("================================================================");

    console.log("================================================================");
    if (!user) {
        return res.status(401).json({message: "요청한 아이디가 존재하지 않습니다"}) // 없을 경우 없다고 알린다.
    }
    const isValidpassword = await(bcrypt.compare(mi_password, user.mi_password)); // 비밀번호가 맞는지 확인
    console.log(mi_userid,mi_password);
    console.log("================================================================");
    console.log(user.mi_password);
    console.log("================================================================");
    // console.log(mi_password);
    if(!isValidpassword){
        return res.status(401).json({message: "아이디 또는 비밀번호를 확인하세요"})
    }
    const token = createJwtToken(user.mi_userid); // 토큰 생성
    res.status(200).json({token, mi_userid})
}

function createJwtToken(id) { // 토큰 생성
    return jwt.sign({id}, config.jwt.secretkey, { expiresIn: config.jwt.expiresInsec});
}