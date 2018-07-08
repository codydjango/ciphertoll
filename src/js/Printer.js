import inventory from './inventory'
import eventManager from './eventManager'
import particleData from './particleData'


class Printer {
    constructor() {

        this.EM = eventManager
        this.particleData = particleData
        // this.inventoryItems = inventory.contents
        this.inventory = inventory
        this.inventoryParticles = inventory.storeMining

        this.printed = {}

        this.name = 'molecular printer'
        this.type = 'item'
        this.element = '#'
        this.description = 'generates objects according to a blueprint. molecules not included.'
        this.div = 'item-printer'
    }





    initSettings(blueprint) {
        this.blueprint = blueprint
        this.requirementTypes = Object.keys(this.blueprint.requirements)
        this.inventoryArr = Object.keys(this.inventoryParticles)
        this.printing = true
        this.found = {}
    }

    confirmInventory() {
        if (this.inventoryArr.length === 0) {
            console.log('you have no particles')
            this.printing = false
        }
    }

    checkRequirements() {

        // possibly refactor type / special arrangements
        // currently breaks when one type match occurs

        this.requirementTypes.forEach(type => {
            this.found[type] = null
            for (let particle in this.particleData) {
                if (this.particleData[particle].type === type) {
                    this.checkParticleByType(particle, type)
                } else if (particle === type) {
                    this.checkSpecialParticle(particle)
                }
            }
        })
    }

    confirmRequirements() {
        this.requirementTypes.forEach(type => {
            if (!this.found[type]) {
                this.printing = false
            }
        })
    }

    checkParticleByType(particle, type) {
        this.inventoryArr.some(ownedParticle => {  // 'some' loop breaks when return = true
            if (ownedParticle === particle) {
                this.checkAmountByType(particle, type)
            }
            return this.found[type] // break out of loop when found
        })
    }

    checkAmountByType(particle, type) {
        if (this.inventoryParticles[particle] >= this.blueprint.requirements[type]) {
            console.log(`you have enough ${particle}!`)
            this.found[type] = { [particle]: this.blueprint.requirements[type] }
        } else {
            console.log(`you don't have enough ${particle}!`)
        }
    }

    checkSpecialParticle(particle) {
        this.inventoryArr.some(ownedParticle => {
            if (ownedParticle === particle) {
                this.checkSpecialAmount(particle)
            }
            return this.found[particle]
        })
    }

    checkSpecialAmount(particle) {
        if (this.inventoryParticles[particle] >= this.blueprint.requirements[particle]) {
            console.log(`you have enough ${particle}!`)
            this.found[particle] = { [particle]: this.blueprint.requirements[particle] }
        } else {
            console.log(`you don't have enough ${particle}!`)
        }
    }





    getParticles() {
        const particlesFound = Object.values(this.found)
        particlesFound.forEach(particleObj => {
            const particleArr = Object.keys(particleObj)
            const particle = particleArr[0]
            console.log(`deducting ${particleObj[particle]} from ${particle}`)

            this.inventoryParticles[particle] -= particleObj[particle]
            console.log(`${particle} left: ${this.inventoryParticles[particle]}`)


        // this.EM.publish('display-mined') // currently need to update display


        })
    }



    print(blueprint) {
        console.log('attempting to print', blueprint.name)

        this.initSettings(blueprint)
        this.confirmInventory()

        if (this.printing) {
            this.checkRequirements()
            this.confirmRequirements()
        }

        console.log('particles ready to print', this.found)

        if (this.printing) this.getParticles()

    }


}

export default Printer
