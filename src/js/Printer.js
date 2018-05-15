import inventory from './inventory'
import eventManager from './eventManager'
import particleData from './particleData'


class Printer {
    constructor() {

        this.EM = eventManager
        this.particleData = particleData
        this.inventoryItems = inventory.contents
        this.inventoryParticles = inventory.storeMining

        this.printed = {}

        this.name = 'molecular printer'
        this.type = 'item'
        this.element = '#'
        this.description = 'generates objects according to a blueprint. molecules not included.'
        this.div = 'item-printer'


    }


    getBlueprint() {

    }


    checkRequirements() {

        const requirementTypes = Object.keys(this.blueprint.requirements)
        this.particlesRequiredByType = []
        this.specialParticlesRequired = []

// rethink this with NEW PARTICLEDATA info (all particles as objects)

        requirementTypes.forEach(particleType => {
            for (let particle in this.particleData) {
                if (this.particleData[particle].type === particleType) {
                    this.particlesRequiredByType.push(this.particleData[particle])
                } else if (particle === particleType) {
                    this.specialParticlesRequired.push(this.particleData[particle])
                }
            }
        })

        console.log('requirementTypes', requirementTypes)
        console.log('particlesRequiredByType', this.particlesRequiredByType)
        console.log('specialParticlesRequired', this.specialParticlesRequired)

    }


    checkParticlesByType() {
        const particleArr = Object.keys(this.inventoryParticles)
        this.particlesRequiredByType.forEach(requiredParticle => {

            particleArr.forEach(ownedParticle => {
                console.log('got here')

                if (requiredParticle.name === ownedParticle) {
                    this.checkParticleAmounts(ownedParticle)
                }
            })

        })
    }

    checkParticleAmounts(ownedParticle) {
        console.log('owned', ownedParticle)
        console.log('')


        // particles req by type is ARR not OBJ

        const requiredType = this.particlesRequiredByType[ownedParticle].type // fails

        if (this.inventoryParticles[ownedParticle] >= this.blueprint.requirements[requiredType]) {
            console.log(`you have enough ${ownedParticle}!`)
        } else {
            console.log(`you don't have enough ${ownedParticle}!`)
        }

    }





    checkSpecialParticles() {

    }


    checkParticleInventory() {

        this.inventoryParticles
        this.particlesRequiredByType
        this.specialParticlesRequired
        this.blueprint.requirements



        // for (let particle in this.blueprint.requirements) {
        //     if (particle === this.inventoryParticles[particle])
        // }


        // console.log('inventory particles', this.inventoryParticles)
    }


    getParticles() {



    }


    print(blueprint) {
        this.blueprint = blueprint

        this.checkRequirements()
        this.checkParticlesByType()

        // const particleInventory = this.checkParticleInventory(requiredParticles)
        this.getParticles()
    }




}

export default Printer
