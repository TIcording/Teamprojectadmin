import {db} from "../db/database.js"

// export async function searchUserId(mi_userid){ // db에 mi_userid가 있는지 확인
//     return db.execute("select * from manager_info where mi_userid=?",[mi_userid]).then((result) => result[0][0]);
// }

// manager.js
export async function searchUserId(mi_userid) {
    if (mi_userid === undefined) {
        mi_userid = null;
    }
    return db.execute("select * from able.Manager_info where mi_userid=?", [mi_userid]).then((result) => result[0][0]);
}


export async function createUser(user) {
    const {mi_userid, mi_password, mi_name, mi_hp,mi_department} = user; // db에 user 데이터를 넣는다.
    return db.execute("insert into able.Manager_info (mi_userid, mi_password, mi_name, mi_hp,mi_department) values(?,?,?,?,?)", [mi_userid, mi_password, mi_name, mi_hp, mi_department]).then((result) => result[0].insertID);
}