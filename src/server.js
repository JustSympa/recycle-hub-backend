import * as Entity from './entity.js'
import { db as Database } from "./temp.database.js"
import { storage as Storage } from "./temp.storage.js"
import * as Vendor from "./vendor.js"

export const IAM = {
    async Login(connection = new Entity.Connection) {
        const user = await Database.readUserByContact({ contact: connection.phone, contact2: connection.phone })
        if(!user) await Database.createUser(new Entity.User(undefined, 'user98235', '', connection.phone, ''))
        (await Database.createConnection(connection)).toObject()
    },
    async Validate(connection = new Entity.Connection) {
        const c = await Database.readConnection({id : connection.id})
        if(c.code == connection.code) {
            await Database.updateConnection({state: Entity.ConnectionState.APPROVED})
            const user = await Database.readUserByContact(connection.phone)
            user.token = Vendor.JWT.generate(user)
            await Database.updateUser({id: user.id, token: user.token})
            return user.toObject()
        }
        else {
            throw new Error("Wrong OTP or Unexpected error!")    
        }
    }
}

export const UserManager = {
    async Read(user = new Entity.User) {
        return (await Database.readUser(user)).toObject()
    },
    async Update(user = new Entity.User) {
        return (await Database.updateUser(user)).toObject()
    },
    async Requests(user = new Entity.User) {
        return [...await Database.readUserRequests(user)].map(n => n.toObject())
    },
    async Proposals(user = new Entity.User) {
        return [...await Database.readUserProposals(user)].map(n => n.toObject())
    },
    async Notifications(user = new Entity.User) {
        return [...await Database.readUserNotifications(user)].map(n => n.toObject())
    },
    async ReadNotification(notification) {
        return (await Database.readUserNotification(notification)).toObject()
    },
}

export const Categories = {
    async Read() {
        return [...await Database.readCategories()].map(n => n.toObject())
    }
}

export const DocumentManager = {
    async Read(doc = new Entity.Document) {
        return (await Database.readDocument(doc)).toObject()
    },
    async ReadContent(doc = new Entity.Document) {
        const result = await Storage.downloadDocument(doc)
        return result
    },
    async Search(params = new Entity.SearchParams) {
        return [...await Database.searchDocument(params)].map(d => d.toObject())
    }
}

export const RequestManager = {
    async Create(params = new Entity.RequestParams) {
        const result = (await Database.createRequest(params.request)).toObject()
        await Database.addRequestCategories(result.id, params.categories)
        return {request: result, categories: params.categories}
    },
    async Read(req = new Entity.Request) {
        return (await Database.readRequest(req)).toObject()
    },
    async Search(params = new Entity.SearchParams) {
        return [...await Database.searchRequest(params)].map(r => r.toObject())
    },
    async Update(req = new Entity.Request) {
        return (await Database.updateRequest(req)).toObject()
    },
    async Delete(req = new Entity.Request) {
        return (await Database.deleteRequest(req)).toObject()
    },
}

export const ProposalManager = {
    async Create(params = new Entity.ProposalParams) {
        const proposal = await Database.createProposal(params.proposal)
        await Database.addProposalCategories(proposal.id, params.categories)
        await Storage.createProposal(proposal)
        const files = await Storage.uploadProposalAsset()
        return {proposal: proposal.toObject(), categories: params.categories, files}
    },
    // async Upload(proposal = new Entity.Proposal, file = new Entity.File) {
    //     return await Storage.uploadProposalAsset(proposal, file)
    // }
}