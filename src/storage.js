import * as Entity from './entity.js'

class StorageInterface {
    async createProposal(proposal = new Entity.Proposal) {
        return ''
    }
    async uploadProposalAsset(proposal = new Entity.Proposal, file = new Entity.File) {
        return ''
    }
    // download content of ./documents/document{id}/content.json
    async downloadDocument(document = new Entity.Document) {
        return {}
    }
    // return the download url for ./documents/document{id}/file
    async getDocumentRessource(document = new Entity.Document, file = '') {
        return ''
    }
}

export const storage = new StorageInterface()