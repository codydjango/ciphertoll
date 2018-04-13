import Item from './Item'

class ParticleMiner extends Item {
    constructor() {
        super()

        this.name = 'particle miner'
        this.type = 'item'
        this.element = '|'
        this.description = 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.'
        this.div = 'item-miner'
    }

}

export default ParticleMiner
