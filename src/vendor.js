import * as Entity from './entity.js'

export const SMS = {
    sendVerification(connection = new Entity.Connection) {
        console.log(`Your RecycleHub verification code is ${connection.code}. Dont share it!`)
    }
}