import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/manager.js';
import { config } from '../config.js';



export async function signup(req, res) {

    const { ui_userid, ui_password, ui_name, ui_email, ui_address, ui_hp } = req.body;
    const found = await userRepository.findByUserid(ui_userid);
    if (found) {
        return res.status(409).json({ message: `${ui_userid}은 이미 가입되었습니다` });
    }
    const hashed = await bcrypt.hash(ui_password, config.bcrypt.saltRound);
    const userId = await userRepository.createUser({
        ui_userid,
        ui_password: hashed,
        ui_name,
        ui_email,
        ui_address,
        ui_hp

    });
    const token = createJwtToken(userId);
    res.status(201).json({ token, ui_userid });
}


export async function login(req, res) {

    const { mi_userid, mi_password } = req.body;
    console.log(mi_userid)
    const user = await userRepository.searchUserId(mi_userid);
    console.log(user)
    if (!user) {
        return res.status(401).json({ message: '요청한 아이디가 존재하지 않습니다' });
    }

    const isValidpassword = await bcrypt.compare(mi_password, user.mi_password);
    if (!isValidpassword) {
        return res.status(401).json({ message: '아이디 또는 비밀번호를 확인하세요' });
    }
    const token = createJwtToken(user.mi_userid);

    res.status(200).json({ token, mi_userid });
}


// export async function me(req, res, next) {
//     const user = await userRepository.findById(req.ui_userid);
//     if (!user) {
//         return res.status(404).json({ message: '사용자가 존재하지 않습니다' });
//     }
//     res.status(200).json({ token: req.token, ui_userid: user.ui_userid });
// }
// function createJwtToken(id) {
//     return jwt.sign({ id }, config.jwt.secretkey, { expiresIn: config.jwt.expiresInsec });
// }

// export async function me(req, res, next) {
//     const ui_userid = req.body.mi_userid; // 사용자 식별자 가져오기
//     console.log('================================================================')
//     console.log(ui_userid)
//     console.log('================================================================')
//     const user = await userRepository.searchUserId(ui_userid);
//     if (!user) {
//         return res.status(404).json({ message: '사용자가 존재하지 않습니다' });
//     }
//     res.status(200).json(user); // 사용자 정보 반환
// }



// // auth.js
// export async function me(req, res, next) {
//     const mi_userid = req.body.mi_userid; // 사용자 식별자 가져오기
//     console.log('================================================================11')
//     console.log(mi_userid)
//     console.log('================================================================11')
//     const user = await userRepository.searchUserId(mi_userid);
//     if (!user) {
//         return res.status(404).json({ message: '사용자가 존재하지 않습니다' });
//     }
//     res.status(200).json(user); // 사용자 정보 반환
// }

// me 함수에 미들웨어 적용
export async function me(req, res, next) {
    const mi_userid = req.user.mi_userid; // 사용자 식별자 가져오기
    console.log('================================================================')
    console.log(mi_userid)
    console.log('================================================================')
    const user = await userRepository.searchUserId(mi_userid);
    if (!user) {
        return res.status(404).json({ message: '사용자가 존재하지 않습니다' });
    }
    res.status(200).json(user); // 사용자 정보 반환
}


function createJwtToken(id) {
    const token = jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
    return token;
}



// export const getUserInfo = async (req, res) => {
//     try {
//         const { ui_userid } = req.params;

//         // 사용자 정보 조회 로직
//         const user = await userRepository.findByMyPage(ui_userid);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // 필요한 정보 추출
//         const userInfo = {
//             ui_name: user.ui_name,
//             ui_address: user.ui_address,
//             ui_hp: user.ui_hp,
//             ui_password: user.ui_password
//         };

//         res.status(200).json(userInfo);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// export const updateUserInfo = async (req, res) => {
//     try {
//         const { ui_userid } = req.params;
//         const { ui_name, ui_address, ui_hp, ui_password } = req.body;

//         const updatedFields = {};

//         if (ui_name) {
//             updatedFields.ui_name = ui_name;
//         }

//         if (ui_address) {
//             updatedFields.ui_address = ui_address;
//         }

//         if (ui_hp) {
//             updatedFields.ui_hp = ui_hp;
//         }

//         if (ui_password) {
//             updatedFields.ui_password = ui_password;
//         }

//         const updatedRows = await userRepository.updateByMyPage(ui_userid, updatedFields);


//         if (updatedRows === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({ message: 'User updated successfully' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };