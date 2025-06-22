import * as Entity from './entity.js'
import { drizzle } from 'drizzle-orm/postgres-js'
import { pgView as view, pgTable as table} from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'
import postgres from 'postgres'
import { and, asc, between, desc, eq, getTableColumns, inArray, like, not, or, sql } from 'drizzle-orm'

const tsvector = t.customType({
    dataType() {return 'tsvector'}
})

const users = table('users', {
    id : t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: t.text('name'),
    token: t.text('token'),
    contact: t.text('contact'),
    contact2: t.text('contact2')
})

const notifications = table('notifications', {
    id : t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
    created: t.timestamp('created_at'),
    read: t.timestamp('read_at'),
    user: t.integer('user').references(() => users.id),
    type: t.integer('type'),
    message: t.text('message')
})

const connections = table('connections', {
    id : t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
    created_at: t.timestamp('created_at'),
    phone: t.text('phone'),
    mail: t.text('email'),
    code: t.varchar('code', {length: 6}),
    state: t.integer('state')
})

const categories = table('categories', {
    id : t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: t.text('name')
})

const proposals = table('proposals', {
    id : t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
    created_at: t.timestamp('created_at'),
    name: t.text('name'),
    user: t.integer('user').references(() => users.id),
    description: t.text('description')
})

const documents = table('documents', {
    id : t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
    created_at: t.timestamp('created_at'),
    name: t.text('name'),
    type: t.integer('type'),
    description: t.text('description'),
    proposal: t.text('proposal').references(() => proposals.id),
    fts: tsvector('fts')
})

const requests = table('requests', {
    id : t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
    created_at: t.timestamp('created_at'),
    user: t.integer('user').references(() => users.id),
    name: t.text('name'),
    amount: t.text('amount'),
    unit: t.text('unit'),
    description: t.text('description'),
    fts: tsvector('fts')
})

const document_categories = table('document_categories', {
    document: t.integer('document').references(() => documents.id),
    category: t.integer('category').references(() => categories.id)
})
const request_categories = table('request_categories', {
    request: t.integer('request').references(() => requests.id),
    category: t.integer('category').references(() => categories.id)
})
const proposal_categories = table('proposal_categories', {
    proposal: t.integer('proposal').references(() => proposals.id),
    category: t.integer('category').references(() => categories.id)
})

class DatabaseInterface {
    constructor() {
        this.pg_client = postgres(process.env.DATABASE_URL, {prepare: false})
        this.db = drizzle(this.pg_client)
    }
    
    async createConnection(connection = new Entity.Connection) {
        connection.id = undefined
        return Entity.Connection.fromObject((await this.db.insert(connections).values(connection.toObject()).returning()).at(0))
    }
    async readConnection(connection = new Entity.Connection) {
        return Entity.Connection.fromObject((await this.db.select().from(connections).where(eq(connections.id, connection.id))).at(0))
    }
    async updateConnection(connection = new Entity.Connection) {
        const object = connection instanceof Entity.Connection ? connection.toObject() : connection
        const result = (await this.db.update(connections).set(object).where((eq(connections.id, connection.id))).returning()).at(0)
        return Entity.Connection.fromObject({...result, ...object})
    }

    async createUser(user = new Entity.User) {
        user.id = undefined
        return Entity.User.fromObject((await this.db.insert(users).values(user.toObject()).returning()).at(0))
    }
    async readUser(user = new Entity.User) {
        const result = (await this.db.select().from(users).where(eq(users.id, user.id))).at(0)
        return result ? Entity.User.fromObject(result) : undefined
    }
    async readUserByContact(user = new Entity.User) {
        const result = (await this.db.select().from(users).where(eq(users.contact, user.contact))).at(0)
        return result ? Entity.User.fromObject(result) : undefined
    }
    async updateUser(user = new Entity.User) {
        const object = user instanceof Entity.User ? user.toObject() : user
        const result = (await this.db.update(users).set(object).where(eq(users.id, user.id)).returning()).at(0)
        return Entity.User.fromObject({...result, ...object})
    }
    async readUserProposals(user = new Entity.User) {
        return (await this.db.select().from(proposals).where(eq(proposals.user, user.id))).map(Entity.Proposal.fromObject)
    }
    async readUserRequests(user = new Entity.Request) {
        return (await this.db.select().from(requests).where(eq(requests.user, user.id))).map(Entity.User.fromObject)
    }
    async createUserNotification(notification = new Entity.Notification) {
        notification.id = undefined
        return Entity.Notification.fromObject((await this.db.insert(notifications).values(notification.toObject()).returning()).at(0))    }
    //     readNotification        |      readNotifications
    // Mark a notification as read | Checks for not read notifications
    async readUserNotifications(user = new Entity.User) {
        return (await this.db.select().from(notifications).where(eq(notifications.user, user.id))).map(Entity.Notification.fromObject)
    }
    async readUserNotification(notification = new Entity.Notification) {
        const read = Date.now()
        const result = (await this.db.update(notifications).set({read}).where(eq(notifications.id, notification.id)).returning()).at(0)
        return Entity.Notification.fromObject({...result, read})
    }

    async readCategories() {
        return (await this.db.select().from(categories)).map(Entity.Category.fromObject)
    }

    async readDocument(document = new Entity.Document) {
        return Entity.Document.fromObject((await this.db.select().from(documents).where(eq(documents.id, document.id))).at(0))
    }
    async searchDocument(params = new Entity.SearchParams) {
        const q = this.db.select().from(documents)
        if(params.categories.length)
        q.leftJoin(document_categories, eq(documents.id, document_categories.document))
        .leftJoin(categories, eq(document_categories.category, categories.id))
        .groupBy(documents.id)
        .where(inArray(categories.id, params.categories))
        q.where(sql`fts @@ websearch_to_tsquery('english', ${params.text})`)
        .orderBy(desc(sql`ts_rank(fts, websearch_to_tsquery('english', ${params.text}))`))

        return (await q).map(Entity.Document.fromObject)
    }

    async createProposal(proposal = new Entity.Proposal) {
        proposal.id = undefined
        return Entity.Proposal.fromObject((await this.db.insert(proposals).values(proposal.toObject()).returning()).at(0))
    }
    async addProposalCategories(proposal = 0, categories = [0]) {
        await this.db.insert(proposal_categories).values(categories.map( category => ({proposal, category}))) 
    }

    async createRequest(request = new Entity.Request) {
        request.id = undefined
        return Entity.Request.fromObject((await this.db.insert(requests).values(request.toObject()).returning()).at(0))
    }
    async addRequestCategories(request = 0, categories = [0]) {
        await this.db.insert(request_categories).values(categories.map( category => ({request, category}))) 
    }
    async removeRequestCategory(request = 0, category = 0) {
        await this.db.delete(request_categories).where(and(
            eq(request_categories.request, request),
            eq(request_categories.category, category)
        )) 
    }
    async readRequest(request = new Entity.Request) {
        return Entity.Request.fromObject((await this.db.select().from(requests).where(eq(requests.id, request.id))).at(0))
    }
    async searchRequest(params = new Entity.SearchParams) {
        const q = this.db.select().from(requests)
        if(params.categories.length)
        q.leftJoin(request_categories, eq(requests.id, request_categories.request))
        .leftJoin(categories, eq(request_categories.category, categories.id))
        .groupBy(requests.id)
        .where(inArray(categories.id, params.categories))
        q.where(sql`fts @@ websearch_to_tsquery('english', ${params.text})`)
        .orderBy(desc(sql`ts_rank(fts, websearch_to_tsquery('english', ${params.text}))`))

        return (await q).map(Entity.Request.fromObject)
    }
    async updateRequest(request = new Entity.Request) {
        const object = request instanceof Entity.Request ? request.toObject() : request
        const result = (await this.db.update(requests).set(object).where().returning()).at(0)
        return Entity.Request.fromObject({...result, ...object})
    }
    async deleteRequest(request = new Entity.Request) {
        return Entity.Request.fromObject((await this.db.delete(requests).where(eq(requests.id, request.id)).returning()).at(0))
    }
}

export const db = new DatabaseInterface()