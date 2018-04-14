import Item from './Item'

class ParticleMiner extends Item {
    constructor() {
        super()

        this.name = 'particle miner'
        this.type = 'item'
        this.element = '|'
        this.description = 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.'
        this.div = 'item-miner'

        // must subscribe the item directly, not on the abstract class
        this.EM.subscribe(`${this.name}-${this.identityNumber} taken`, this.onTake, this)
    }

    mine(location) {
        this.setMiningConfig()
        this.extractLocalMaterials(this.determineLocalMaterialAmounts(location))
        this.setOnMap(this.map, location)
        this.drawLayer(this.div)
    }

    setMiningConfig() {
        this.offMap = false
        this.mining = true
        // this.spinning = true
    }

    determineLocalMaterialAmounts(location) {
        const localParticles = this.map[location[1]][location[0]].particles
        const particleArray = []
        Object.keys(localParticles).forEach(particle => {
            let numberOfParticles = localParticles[particle]
            while (numberOfParticles) {
                particleArray.push(particle)
                numberOfParticles--
        }})
        return particleArray
    }




    extractLocalMaterials(particleArray) {


    }





}

export default ParticleMiner
