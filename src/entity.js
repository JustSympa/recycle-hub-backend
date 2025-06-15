export const ConnectionState = {
    PENDING: 1,
    APPROVED: 2,
    CANCELED: 3
}

export const DocumentTypes = {
    TUTORIAL: 1
}

export const NotificationTypes = {
    REQUEST_ADDED: 1,
    PROPOSAL_ACCEPTED: 2
}

export class Category {
    id = 0; name = ''
    constructor(id, name) {
        this.id = id
        this.name = name
    }
    toString() { return this.toJSON() }
    toObject() { return { id: this.id, name: this.name }}
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Category(object.id, object.name)}
    static fromJSON(object) { return Category.fromObject(JSON.parse(object)) }
}

export class Connection {
    id = 0; code = ''; created = new Date; phone = ''; mail = ''; state = ConnectionState.PENDING
    constructor(id, code, created, phone, mail, state) {
        this.id = id
        this.code = code
        this.created = created
        this.phone = phone
        this.mail = mail
        this.state = state
    }
    toString() { return this.toJSON() }
    toObject() { return { id: this.id, code: this.code, created: this.created, phone: this.phone, mail: this.mail, state: this.state } }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Connection(object.id, object.code, object.created, object.phone, object.mail, object.state) }
    static fromJSON(object) { return Connection.fromObject(JSON.parse(object)) }
}

export class Document {
    id = 0; created = new Date; name = ''; type = DocumentTypes.TUTORIAL; description = ''; proposal = null
    constructor(id, created, name, type, description, proposal) {
        this.id = id
        this.created = created
        this.name = name
        this.type = type
        this.description = description
        this.proposal = proposal
    }
    toString() { return this.toJSON() }
    toObject() { return { id: this.id, created: this.created, name: this.name, type: this.type, description: this.description, proposal: this.proposal } }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Document(object.id, object.created, object.name, object.type, object.description, object.proposal)}
    static fromJSON(object) { return Document.fromObject(JSON.parse(object)) }
}

export class File {
    name= ''; path=''; content= ''
    constructor(name='', path='', content='') {
        this.name = name; this.path = path; this.content = content
    }
    toObject() { return {
        name: this.name,
        path: this.path,
        content: this.content
    }}
    toJSON() { return JSON.stringify(this.toObject()) }
    toString() { return this.toJSON() }
    static fromObject(object) { return new File(object.name, object.path, object.content)}
    static fromJSON(object) { return File.fromObject(JSON.parse(object)) }
}

export class Notification {
    id = 0; created = new Date; read = new Date; user = 0; type = NotificationTypes.PROPOSAL_ACCEPTED; message = ''
    constructor(id, created, read, user, type, message) {
        this.id = id
        this.created = created
        this.read = read
        this.user = user
        this.type = type
        this.message = message
    }
    toString() { return this.toJSON() }
    toObject() {return {id: this.id, created: this.created, read: this.read, user: this.user, type: this.type, message: this.message} }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Notification(object.id, object.created, object.read, object.user, object.type, object.message) }
    static fromJSON(object) { return Notification.fromObject(JSON.parse(object)) }
}

export class Proposal {
    id = 0; user = 0; name = new Date; description = new Date
    constructor(id, user, name, description) {
        this.id = id
        this.user = user
        this.name = name
        this.description = description
    }
    toString() { return this.toJSON() }
    toObject() { return {id: this.id, user: this.user, name: this.name, description: this.description} }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Proposal(object.id, object.user, object.name, object.description) }
    static fromJSON(object) { return Proposal.fromObject(JSON.parse(object)) }
}

export class ProposalParams {
    proposal = new Proposal; categories = [0]; files = ['']
    constructor(proposal, categories, files) { this.proposal = proposal; this.categories = categories; this.files = files }
    toString() { return this.toJSON() }
    toObject() { return {proposal: this.proposal, categories: this.categories, files: this.files} }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Proposal(object.proposal, object.categories, object.files) }
    static fromJSON(object) { return Proposal.fromObject(JSON.parse(object)) }
}

export class Request {
    id = 0; user = 0; name = ''; amount = 0; unit = ''; description = ''
    constructor(id, user, name, amount, unit, description) {
        this.id = id
        this.user = user
        this.name = name
        this.amount = amount
        this.unit = unit
        this.description = description
    }
    toString() { return this.toJSON() }
    toObject() { return { id: this.id, user: this.user, name: this.name, amount: this.amount, unit: this.unit, description: this.description } }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Request(object.id, object.user, object.name, object.amount, object.unit, object.description)}
    static fromJSON(object) { return Request.fromObject(JSON.parse(object)) }
}

export class RequestParams {
    request = new Request; categories = [0]
    constructor(request, categories) { this.request = request; this.categories = categories }
    toString() { return this.toJSON() }
    toObject() { return {request: this.request, categories: this.categories} }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new Request(object.request, object.categories) }
    static fromJSON(object) { return Request.fromObject(JSON.parse(object)) }
}

export class SearchParams {
    text = ''
    categories = [0]
    constructor(text, categories) { this.text = text; this.categories = categories }
    toString() { return this.toJSON() }
    toObject() { return {text: this.text, categories: this.categories} }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new SearchParams(object.text, object.categories) }
    static fromJSON(object) { return SearchParams.fromObject(JSON.parse(object)) }
}

export class User {
    id = 0; name = ''; token = ''; contact = ''; contact2 = ''
    constructor(id, name, token, contact, contact2) {
        this.id = id
        this.name = name
        this.token = token
        this.contact = contact
        this.contact2 = contact2
    }
    toString() { return this.toJSON() }
    toObject() { return {id: this.id, name: this.name, token: this.token, contact: this.contact, contact2: this.contact2} }
    toJSON() { return JSON.stringify(this.toObject()) }
    static fromObject(object) { return new User(object.id, object.name, object.token, object.contact, object.contact2) }
    static fromJSON(object) { return User.fromObject(JSON.parse(object)) }
}