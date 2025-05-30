import * as Entity from './entity.js'

class DatabaseInterface {
    async createConnection(connection = new Entity.Connection) {
        return new Entity.Connection
    }
    async readConnection(connection = new Entity.Connection) {
        return new Entity.Connection
    }
    async updateConnection(connection = new Entity.Connection) {
        return new Entity.Connection
    }

    async createUser(user = new Entity.User) {
        return new Entity.User
    }
    async readUser(user = new Entity.User) {
        return new Entity.User
    }
    async readUserByContact(user = new Entity.User) {
        return new Entity.User
    }
    async updateUser(user = new Entity.User) {
        return new Entity.User
    }
    async createUserNotification(notification = new Entity.Notification) {
        return new Entity.Notification
    }
    //     readNotification        |      readNotifications
    // Mark a notification as read | Checks for not read notifications
    async readUserNotifications(user = new Entity.User) {
        return [new Entity.Notification]
    }
    async readUserNotification(notification = new Entity.Notification) {
        return new Entity.Notification
    }

    async readDocument(document = new Entity.Document) {
        return new Entity.Document
    }
    async searchDocument(params = new Entity.SearchParams) {
        return [new Entity.Document]
    }

    async createProposal(proposal = new Entity.Proposal) {
        return new Entity.Proposal
    }

    async createRequest(request = new Entity.Request) {
        return new Entity.Request
    }
    async readRequest(request = new Entity.Request) {
        return new Entity.Request
    }
    async searchRequest(params = new Entity.SearchParams) {
        return [new Entity.Request]
    }
    async updateRequest(request = new Entity.Request) {
        return new Entity.Request
    }
    async deleteRequest(request = new Entity.Request) {
        return new Entity.Request
    }
}

export const db = new DatabaseInterface()