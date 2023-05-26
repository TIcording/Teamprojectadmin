import * as requestRepository from '../data/request.js'

export async function getRequest(req, res){ // 모든 문의의 내용을 받는 함수
    const data = await (requestRepository.getAll()); // data 폴더의 request.js 파일 내에 있는 getAll 함수이다.
    res.status(200).json(data);
}

export async function answerRequest(req, res){ // 문의에 대한 답변을 보낸다.
    const id = req.params.id // 문의의 id값
    const answer = req.body.ua_answer // 문의에 대한 답

    const send = await requestRepository.sendRequest(id, answer) // data 폴더의 request.js 파일 내에 있는 sendRequest함수이다.
    res.status(200).json(send)
}

export async function getRequest_noAnswer(req, res){ // 답변이 없는 문의를 가져온ㄷ.ㅏ
    const data = await (requestRepository.getRequest_noAnswer()); // data 폴더의 request.js 파일 내에 있는 getRequest_noAnswer함수이다.
    res.status(200).json(data);
}