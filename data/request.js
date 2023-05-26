import {db} from "../db/database.js"


export async function getAll(){ // 문의 내용 전부 출력
    return db.execute("select * from able.User_answer").then((result) => result[0]);
}

export async function sendRequest(id, answer) { // 문의에 대한 답변을 보낸다.
    let change_answer = '"'+answer+'"' // sql문에 맞게 변경
    return db.execute(`update able.User_answer SET ua_answer=${change_answer}, ua_resolution=0 where ua_idx=${id}`)
}


export async function getRequest_noAnswer(){ // 답변이 없는 문의만 출력한다.
    return db.execute("select * from able.User_answer where ua_resolution=1").then((result) => result[0]);
}
