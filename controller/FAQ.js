import * as FAQRepository from '../data/FAQ.js';

export async function sendFAQ(req, res){ // FAQ 보내는 요소
    const keys = Object.keys(req.body) // postman에서 body부분의 key값들
    const values = Object.values(req.body) // postman에서 body부분의 value값들

    const send = await FAQRepository.sendFAQ(keys, values) // data폴더의 FAQ.js 파일의 sendFAQ함수이다.
    res.status(200).json("등록되었습니다");
}