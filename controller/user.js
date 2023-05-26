import * as userRepository from '../data/user.js';

export async function getUser(req, res) { // 모든 회원 정보를 가져온다.
    const data = await (userRepository.getAll()); // data폴더의 user.js 파일 내에 있는 getAll함수이다.
    res.status(200).json(data);
};

export async function updateUser(req, res) { // 회원 정보 갱신
    const id = req.params.id; // 회원의 ui_idx 값
    const keys = Object.keys(req.body); // postman의 body에 있는 key값 => 바꾸고자 하는 column들의 집합
    const values = Object.values(req.body); // postman의 body에 있는 value값 => 바꾸고자 하는 column들의 내용의 집합
    const user = await userRepository.getById(id); // 회원정보가 있는지 확인

    if(!user){
        res.status(404).json({message: `User idx(${id}) not found`}); // idx가 없는 경우 없다고 메세지를 보낸다.
    }

    const updated = await userRepository.updateUser(id,keys,values); // idx값이 있는 경우 data 폴더의 user.js 파일 내에 있는 updateUser함수로 id, keys, values를 보내서 수정하게 한다.
    res.status(200).json(updated); // 수정된 내용을 response로 보낸다. => postman의 결과로 나온다.
};

export async function secession(req, res) { // 회원 탈퇴를 처리한다.
    const id = req.params.id; // 회원의 ui_idx값
    const join = req.body.ui_join // 회원의 탈퇴 여부를 나누는 값

    const user = await userRepository.getById(id); // 회원 정보가 존재하는지 확인

    if(!user){
        res.status(404).json({message: `User idx(${id}) not found`});
    }

    const updated = await userRepository.updateUser_secession(id, join); // 회원 탈퇴를 다루는 함수로 보낸다.
    res.status(200).json(updated) // 처리한 결과를 response로 전송한다.
}