import express, { Router, request, response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import multer from 'multer'
import * as Server from './server.js'
import * as Entity from './entity.js'

export const io = express()
io.use(cors())
io.use(bodyParser.json())
io.use(function(rq, rs, next){
    if(rq.method == 'GET') rq.body = {...rq.body, ...rq.query}
    // console.log(rq.body)
    next()
})

io.get('/', (req, res) => res.send("OK") )
