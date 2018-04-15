import Item from './Item'
import Utility from 'js/Utility'

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

        this.minedParticles = {}
    }

    mine(location) {
        this.setMiningConfig()

        this.cancellationKey = window.setInterval(() => {
            this.extractParticles(this.determineParticleAmounts(location))
        }, 3000)

        this.setOnMap(this.map, location)
        this.drawLayer(this.div)
    }

    setMiningConfig() {
        this.offMap = false
        this.mining = true
        // this.spinning = true
    }

    determineParticleAmounts(location) {
        const localParticles = this.map[location[1]][location[0]].particles
        const allParticles = []
        Object.keys(localParticles).forEach(particle => {
            let numberOfParticles = localParticles[particle]
            while (numberOfParticles) {
                allParticles.push(particle)
                numberOfParticles--
        }})
        return allParticles
    }


    extractParticles(allParticles) {
        const randomParticle = allParticles[Utility.randomize(allParticles.length)]
        if (!this.minedParticles[randomParticle]) {
            this.minedParticles[randomParticle] = 1
        } else {
            this.minedParticles[randomParticle]++
        }

        this.displayParticlesMined()

    }


    displayParticlesMined() {

        const str = this.cleanJSONString(JSON.stringify(this.minedParticles))
        this.EM.publish('status', str)

        console.log('particles mined', this.minedParticles)
    }

    cleanJSONString(string) {
        string = string.replace(/"/g, '')
        string = string.replace(/:/g, ' ')
        string = string.replace(/{/g, '')
        string = string.replace(/}/g, '')
        string = string.replace(/,/g, ' | ')
        return string
    }



    haltMining() {
        this.mining = false
        window.clearInterval(this.cancellationKey)
    }

}

export default ParticleMiner
