import {db} from "../db/database.js"

export async function sendFAQ(keys, values){ // FAQ 보내기
    let key = "" // column 이름을 SQL 명령문에 맞게 만든다.
    for (let i = 0; i < keys.length; i++){
        let string = `${keys[i]}`
        if (i < keys.length - 1) {
            string += `, `
        }
        key += string
    }

    let value = "" // column에 들어갈 내용들을 SQL 명령문에 맞게 정리한다.
    for (let i = 0; i < values.length; i++){
        let string = "'"+values[i]+"'"+` `
        if (i < values.length - 1) {
            string += `, `
        }
        value += string
    }
    return db.execute(`insert able.Faq_info (${key}) values(${value})`)
}