import * as Entity from './entity.js'

class StorageInterface {
    async createProposal(proposal = new Entity.Proposal) {
        return ''
    }
    async uploadProposalAsset(proposal = new Entity.Proposal, file = new Entity.File) {
        return ''
    }
}

export const storage = new StorageInterface()