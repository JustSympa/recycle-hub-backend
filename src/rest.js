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

// --- USER CRUD & NOTIFICATIONS ---
// READ User
io.get('/users/:id', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ id: Number(req.params.id) })
        const result = await Server.UserManager.Read(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})
// UPDATE User
io.put('/users/:id', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ ...req.body, id: Number(req.params.id) })
        const result = await Server.UserManager.Update(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// CREATE User
io.post('/users', async (req, res) => {
    try {
        const user = Entity.User.fromObject(req.body)
        const result = await Server.UserManager.Update(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// DELETE User (simulate by setting name to empty)
io.delete('/users/:id', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ id: Number(req.params.id), name: '' })
        const result = await Server.UserManager.Update(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// Get all notifications for a user
io.get('/users/:id/notifications', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ id: Number(req.params.id) })
        const result = await Server.UserManager.Notifications(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// Get a single notification for a user
io.get('/users/:id/notifications/:notificationId', async (req, res) => {
    try {
        const notification = Entity.Notification.fromObject({ id: Number(req.params.notificationId), user: Number(req.params.id) })
        const result = await Server.UserManager.ReadNotification(notification)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})

// --- DOCUMENT ---
// CREATE Document (not implemented in server)
// READ Document
io.get('/documents/:id', async (req, res) => {
    try {
        const doc = Entity.Document.fromObject({ id: Number(req.params.id) })
        const result = await Server.DocumentManager.Read(doc)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})
// UPDATE Document (not implemented in server)
// DELETE Document (not implemented in server)
// SEARCH Document
io.post('/documents/search', async (req, res) => {
    try {
        const params = Entity.SearchParams.fromObject(req.body)
        const result = await Server.DocumentManager.Search(params)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// READ Document Content
io.get('/documents/:id/content', async (req, res) => {
    try {
        const doc = Entity.Document.fromObject({ id: Number(req.params.id) })
        const result = await Server.DocumentManager.ReadContent(doc)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})

// --- REQUEST ---
// CREATE Request
io.post('/requests', async (req, res) => {
    try {
        const params = Entity.RequestParams.fromObject(req.body)
        const result = await Server.RequestManager.Create(params)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// READ Request
io.get('/requests/:id', async (req, res) => {
    try {
        const request = Entity.Request.fromObject({ id: Number(req.params.id) })
        const result = await Server.RequestManager.Read(request)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})
// SEARCH Request
io.post('/requests/search', async (req, res) => {
    try {
        const params = Entity.SearchParams.fromObject(req.body)
        const result = await Server.RequestManager.Search(params)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// UPDATE Request
io.put('/requests/:id', async (req, res) => {
    try {
        const request = Entity.Request.fromObject({ ...req.body, id: Number(req.params.id) })
        const result = await Server.RequestManager.Update(request)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// DELETE Request
io.delete('/requests/:id', async (req, res) => {
    try {
        const request = Entity.Request.fromObject({ id: Number(req.params.id) })
        const result = await Server.RequestManager.Delete(request)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})

// --- PROPOSAL ---
// CREATE Proposal
io.post('/proposals', async (req, res) => {
    try {
        const params = Entity.ProposalParams.fromObject(req.body)
        const result = await Server.ProposalManager.Create(params)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// READ Proposal (not implemented in server)
// UPDATE Proposal (not implemented in server)
// DELETE Proposal (not implemented in server)

// --- IAM ---
// LOGIN
io.post('/iam/login', async (req, res) => {
    try {
        const connection = Entity.Connection.fromObject(req.body)
        const result = await Server.IAM.Login(connection)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// VALIDATE
io.post('/iam/validate', async (req, res) => {
    try {
        const connection = Entity.Connection.fromObject(req.body)
        const result = await Server.IAM.Validate(connection)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})

// io.get('/', (req, res) => res.json({ success: true, data: 'ok' }) )
