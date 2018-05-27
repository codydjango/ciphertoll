import Item from './Item'
import Utility from 'js/Utility'

class ParticleMiner extends Item {
    constructor() {
        super()
        this.initSettings()
    }

    initSettings() {
        this.name = 'particle miner'
        this.type = 'item'
        this.element = '|'
        this.description = 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.'
        this.div = 'item-miner'
        // must subscribe the item directly, not on the abstract class
        this.EM.subscribe(`${this.name}-${this.identityNumber} taken`, this.onTake, this)

        this.minedParticles = {
            ID: this.identityNumber
        }
    }

    mine(location) {

        this.locale = this.map[location[1]][location[0]]
        this.setMiningConfig()

        // calculate ratios once, rather than w every interval
        this.determineParticleRatios()
        this.checkParticleAmounts()
        this.cancellationKey = window.setInterval(() => {
            this.checkParticleAmounts()
        }, 3000)

        this.setOnMap(this.map, location)
        this.render()
    }

    setMiningConfig() {
        this.offMap = false
        if (!this.mining) {
            this.mining = 'full'
        }
    }

    determineParticleRatios() {
        this.allParticles = []
        Object.keys(this.locale.particles).forEach(particle => {
            let numberOfParticles = this.locale.particles[particle]
            while (numberOfParticles) {
                this.allParticles.push(particle)
                numberOfParticles--
        }})
    }


    extractParticles() {
        const randomParticle = this.allParticles[Utility.randomize(this.allParticles.length)]
        if (!this.minedParticles[randomParticle]) {
            this.minedParticles[randomParticle] = 1
        } else {
            this.minedParticles[randomParticle]++
        }
        const minedObj = this.minedParticles
        this.EM.publish('add-mined', minedObj)
    }



    checkParticleAmounts() {
        if (this.locale.particleAmount === 0) {
                this.mining = 'empty'
            } else if (this.locale.particleAmount >= (this.locale.maxParticles / 2)) {
                this.mining = 'full'
                this.locale.particleAmount--
                this.extractParticles()
            } else if (this.locale.particleAmount < (this.locale.maxParticles / 2)) {
                this.mining = 'half'
                this.locale.particleAmount--
                this.extractParticles()
            }
            this.render()
    }


    render() {
        this.updateDiv(this)
        this.drawLayer(this.div)
    }


    haltMining() {
        // this.mining = false
        window.clearInterval(this.cancellationKey)
    }





}

export default ParticleMiner
