import * as Entity from './entity.js'
import { generate } from 'otp-generator'
import jwt from 'jsonwebtoken'

export const SMS = {
    sendVerification(connection = new Entity.Connection) {
        console.log(`Your RecycleHub verification code is ${connection.code}. Dont share it!`)
    }
}

export const OTP = {
    generate() { return '123456'/*return generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})*/ }
}

export const JWT = {
    generate(user = (new Entity.User).toObject()) { return jwt.sign({id: user.id, contact: user.contact}, 'recycle-hub-key') },
    decode(token) { return jwt.decode(token) }
}