import * as Entity from './entity.js'
import { db as Database } from "./database.js"
import { storage as Storage } from "./storage.js"

export const IAM = {
    async Login(connection = new Entity.Connection) {
        const user = await Database.readUserByContact({ contact: connection.phone, contact2: connection.phone })
        if(!user) await Database.createUser(new Entity.User(undefined, 'user98235', '', connection.phone, ''))
        await Database.createConnection(connection)
    },
    async Validate(connection = new Entity.Connection) {
        const c = await Database.readConnection({id : connection.id})
        if(c.code == connection.code) {
            Database.updateConnection({state: Entity.ConnectionState.APPROVED})
        }
        else {
            
        }
    }
}

export const UserManager = {
    async Read(user = new Entity.User) {
        return await Database.readUser(user)
    },
    async Update(user = new Entity.User) {
        return await Database.updateUser(user)
    },
    async Notifications(user = new Entity.User) {
        return await Database.readUserNotifications(user)
    },
    async ReadNotification(notification) {
        return await Database.readUserNotification(notification)
    },
}

export const DocumentManager = {
    async Read(doc = new Entity.Document) {
        return await Database.readDocument(doc)
    },
    async Search(params = new Entity.SearchParams) {
        return await Database.searchDocument(params)
    }
}

export const RequestManager = {
    async Create(req = new Entity.Request) {
        return await Database.createRequest(req = new Entity.Request)
    },
    async Read(req = new Entity.Request) {
        return await Database.readRequest(req)
    },
    async Search(params = new Entity.SearchParams) {
        return await Database.searchRequest(params)
    },
    async Update(req = new Entity.Request) {
        return await Database.updateRequest(req)
    },
    async Delete(req = new Entity.Request) {
        return await Database.deleteRequest(req)
    },
}

export const ProposalManager = {
    async Create(proposal = new Entity.Proposal) {
        const result = await Database.createProposal(proposal)
        Storage.createProposal(proposal)
        return result
    }
}