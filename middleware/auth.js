import jwt from 'jsonwebtoken';
import * as userRepository from '../data/manager.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: '인증 에러!' };

export const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json(AUTH_ERROR);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwt.secretKey);
        console.log(decoded)
        const user = await userRepository.searchUserId(decoded.id);
        console.log(user)

        if (!user) {
            return res.status(403).json(AUTH_ERROR);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(402).json(AUTH_ERROR);
    }
};


// import jwt from 'jsonwebtoken'
// import * as userRepository from '../data/auth.js'
// import {config} from '../config.js';

// const AUTH_ERROR = { message: '인증 에러!' }  // 로그인되지 않았거나 token 에러난 경우 메시지 출력
// // 인증이 됐는지에 대한 여부를 나타내는 비동기 함수
// export const isAuth = async (req, res, next) => {
//     const authHeader = req.get('Authorization')  // GET방식으로 header에 있는 key값(Authorization)으로 가져옴
//     // Authorization라는 key가 없고 'Bearer '로 시작하는 데이터가 없다면
//     if (!(authHeader && authHeader.startsWith('Bearer '))) {
//         return res.status(401).json(AUTH_ERROR)
//     }
//     // 있으면
//     const token = authHeader.split(' ')[1]   // token값만 가져오기
//     jwt.verify(
//         token,
//         //토큰 해석하는 secretkey(contoller/auth.js)
//         config.jwt.secretkey,
//         async (error, decoded) => {
//             if (error) {
//                 return res.status(402).json(AUTH_ERROR);
//             }
//             const user = await userRepository.findByUserid(decoded.id);  // decoded(디코딩된 정보)의 id로 userRepository에서 데이터를 찾아 user에 저장
//             if (!user) {
//                 return res.status(403).json(AUTH_ERROR);
//             }
//             req.id = user.ui_userid;
//             next();
//         }
//     )
// }