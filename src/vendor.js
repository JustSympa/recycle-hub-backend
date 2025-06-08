import * as Entity from './entity.js'
import axios from 'axios'
import { generate } from 'otp-generator'
import jwt from 'jsonwebtoken'

export const SMS = {
    token_type: '',
    token: '',
    expires: 0,
    async refreshToken() {
        if(Date.now() < this.expires) return
        const form = new FormData()
        form.append('grant_type', 'client_credentials')
        const {access_token, expires_in, token_type} = await axios({
            data: form,
            headers: {
                "Authorization": `Basic ${process.env.SMS_KEY}`
            },
            method: 'POST',
            url: 'https://api.orange.com/oauth/v3/token'
        })
        this.token = access_token; this.expires = Date.now() + expires_in * 1000; this.token_type = token_type
    },
    async sendVerification(connection = new Entity.Connection) {
        await this.refreshToken()
        try{    
            axios({
                data: {
                    outboundSMSMessageRequest: {
                        address: `tel:+237${connection.phone}`,
                        senderAddress:`tel:+237${process.env.SMS_SENDER}`,
                        senderName: "RecycleHub Cameroon",
                        outboundSMSTextMessage: {
                            message: `Your RecycleHub verification code is ${connection.code}. Dont share it!`
                        }
                    }
                },
                headers: {
                    "Authorization": `${this.token_type} ${this.token}`
                },
                method: 'POST',
                url: `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B237${process.env.SMS_SENDER}/requests`
            })
        } catch(err) { console.log(err) }
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