import * as Entity from './entity.js'
import { createClient } from '@supabase/supabase-js'

class StorageInterface {
    constructor(){
        this.client = createClient(process.env.STORAGE_URL, process.env.STORAGE_ACCESS)
    }
    async createProposal(proposal = new Entity.Proposal) {
        return ''
    }
    async uploadProposalAsset(proposal = new Entity.Proposal, files = []) {
        return await Promise.all(files.map(async file => (await this.client.storage.from('cdn').upload(`proposals/pro${proposal.id}/${file}`, file )).data))
    }
    // download content of ./documents/document{id}/content.json
    async downloadDocument(document = new Entity.Document) {
        const {data} = await this.client.storage.from('cdn').download(`documents/doc${document.id}/content.json`)
        const result = JSON.parse(await data.text())
        for(let element of result.sections)
            if(element.type == 'video' || element.type == 'image')
                element.link = this.client.storage.from('cdn').getPublicUrl(`documents/doc${document.id}/${element.link}`)
        return result
    }
}

export const storage = new StorageInterface()