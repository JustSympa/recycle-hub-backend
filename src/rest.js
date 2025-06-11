import express, { Router, request, response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import multer from 'multer'
import * as Server from './server.js'
import * as Entity from './entity.js'

// Configure multer for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     fileSize: 5 * 1024 * 1024, // 5MB limit
    // }
})

export const io = express()
io.use(cors())
const skip_bodyparser = ['/proposal/create']
io.use(function(req, res, next){
    if(skip_bodyparser.includes(req.path)) next()
    else bodyParser.json()(req, res, next)
})
io.use(function(rq, rs, next){
    if(rq.method == 'GET') rq.body = {...rq.body, ...rq.query}
    // console.log(rq.body)
    next()
})

// --- USER CRUD & NOTIFICATIONS ---
// READ User
io.get('/user/read', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ id: Number(req.body.id) })
        const result = await Server.UserManager.Read(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})
// UPDATE User
io.put('/user/update', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ ...req.body, id: Number(req.body.id) })
        const result = await Server.UserManager.Update(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// CREATE User
//io.post('/user', async (req, res) => {
  //  try {
  //      const user = Entity.User.fromObject(req.body)
  //      const result = await Server.UserManager.Update(user)
  //      res.json({ success: true, data: result })
  //  } catch (err) {
 //       res.status(400).json({ success: false, error: err.message })
 //   }
//})
// DELETE User
//io.delete('/user/:id', async (req, res) => {
  //  try {
  //      const user = Entity.User.fromObject({ id: Number(req.params.id), name: '' })
  //      const result = await Server.UserManager.Update(user)
  //      res.json({ success: true, data: result })
  //  } catch (err) {
  //      res.status(400).json({ success: false, error: err.message })
  //  }
//  })
// Get all notifications for a user
io.get('/user/notifications', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ id: Number(req.body.id) })
        const result = await Server.UserManager.Notifications(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// Mark notification as read for a user
io.post('/user/readnotification', async (req, res) => {
    try {
        const notification = Entity.Notification.fromObject({ id: Number(req.body.id), user: Number(req.params.id) })
        const result = await Server.UserManager.ReadNotification(notification)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})
// Get user requests
io.get('/user/requests', async (req, res) => {
    try {
        const user = Entity.User.fromObject({ id: Number(req.body.id) })
        const result = await Server.UserManager.Requests(user)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// Get user proposals with file upload
io.post('/user/proposals', upload.array('files', 5), async (req, res) => {
    try {
        const user = Entity.User.fromObject({ id: Number(req.body.id) })
        const proposals = await Server.UserManager.Proposals(user)
        // // If files were uploaded, process them
        // if (req.files && req.files.length > 0) {
        //     const fileNames = req.files.map(file => file.originalname)
        //     const uploadUrls = await Server.ProposalManager.Create({
        //         proposal: new Entity.Proposal(),
        //         categories: []
        //     })
            
        //     // Add the upload URLs to the response
        //     proposals.push({
        //         ...proposals[0],
        //         files: uploadUrls.files
        //     })
        // }
        res.json({ success: true, data: proposals })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})

// --- DOCUMENT ---
// CREATE Document (not implemented in server)
// READ Document
io.get('/document/read', async (req, res) => {
    try {
        const doc = Entity.Document.fromObject({ id: Number(req.body.id) })
        const result = await Server.DocumentManager.Read(doc)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})
// UPDATE Document (not implemented in server)
// DELETE Document (not implemented in server)
// SEARCH Document
io.get('/document/search', async (req, res) => {
    try {
        const params = Entity.SearchParams.fromObject(req.body)
        const result = await Server.DocumentManager.Search(params)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// READ Document Content
io.get('/document/content', async (req, res) => {
    try {
        const doc = Entity.Document.fromObject({ id: Number(req.body.id) })
        const result = await Server.DocumentManager.ReadContent(doc)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})

// --- REQUEST ---
// CREATE Request
io.post('/request/create', async (req, res) => {
    try {
        const params = Entity.RequestParams.fromObject(req.body)
        const result = await Server.RequestManager.Create(params)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// READ Request
io.get('/request/read', async (req, res) => {
    try {
        const request = Entity.Request.fromObject({ id: Number(req.body.id) })
        const result = await Server.RequestManager.Read(request)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})
// SEARCH Request
io.post('/request/search', async (req, res) => {
    try {
        const params = Entity.SearchParams.fromObject(req.body)
        const result = await Server.RequestManager.Search(params)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// UPDATE Request
io.put('/request/update', async (req, res) => {
    try {
        const request = Entity.Request.fromObject(req.body)
        const result = await Server.RequestManager.Update(request)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})
// DELETE Request
io.delete('/request/delete', async (req, res) => {
    try {
        const request = Entity.Request.fromObject({ id: Number(req.body.id) })
        const result = await Server.RequestManager.Delete(request)
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})

// --- PROPOSAL ---
// CREATE Proposal
io.post('/proposal/create', upload.array('files'), async (req, res) => {
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

// --- CATEGORIES ---
// Get all categories
io.get('/categories', async (req, res) => {
    try {
        const result = await Server.Categories.Read()
        res.json({ success: true, data: result })
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
})

// io.get('/', (req, res) => res.json({ success: true, data: 'ok' }) )
