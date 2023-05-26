import {db} from "../db/database.js"

export async function getAll(){ // 회원 정보 출력
    return db.execute("select * from able.User_info").then((result) => result[0]);
}

export async function getById(id) { // 회원 정보가 있는지 확인
    return db.execute(`select * from able.User_info where ui_idx=?`, [id]).then((result) => result[0][0]);;
}

export async function updateUser(id,keys, values) { // 회원정보 갱신
    let execute = "" // SQL 명령문에 맞게 고치기 위해 만들었다
    for (let i = 0; i < keys.length; i++){
        let string = `${keys[i]}=`+"'"+values[i]+"'"+` `
        if (i < keys.length - 1) {
            string += `, `
        }
        execute += string
    }
    return db.execute(`update able.User_info SET ${execute} where ui_idx=${id}`).then(() => getById(id))
}

export async function updateUser_secession(id,ui_join) { //회원 탈퇴 처리
    return db.execute("update able.User_info SET ui_join=? where ui_idx=?",[ui_join,id]).then(()=> getById(id));
}
