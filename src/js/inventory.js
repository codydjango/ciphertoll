import eventManager from './eventManager'

class Inventory {
    constructor() {
        this.contents = []
        this.EM = eventManager
        this.EM.subscribe('add-inventory', this.add, this)
        this.EM.subscribe('remove-inventory', this.remove, this)
        this.EM.subscribe('add-mined', this.addMined, this)

        this.storeMining = {}
        this.miningStateObj = {}

        // testing printer with stocked particles

        this.storeMining = {
            copper: 100,
            chrome: 100,
            lead: 100,
            iron: 100,
            styrofoam: 100,
            acrylic: 100,
            latex: 100,
            wood: 100,
            fiber: 100,
            bone: 100,
            glass: 100,
            silicon: 100,
            ceramic: 100,
            mercury: 100,
            carbon: 100,
            ozone: 100,
            benzene: 100,
            uranium: 100
        }

    }

    add(item) {
        this.contents.push(item)
        this.update()
    }

    remove(item) {
        const theItem = item
        this.contents.forEach((item, i, array) => {
            if (array[i] === theItem) {
                this.contents.splice(i, 1)
                console.log('inventory item removed')
                this.update()
            }})
    }

    update() {
        this.EM.publish('display-inventory', this.contents)
    }






    addMined(currentObj) {
        // if state object doesn't exist, add all particles to storage
        if (!this.miningStateObj[currentObj.ID]) {
            this.updateMiningState(currentObj)
            this.incrementStorage(this.stripID(currentObj))

        // if it does exist, check curr vs state and add only the right particles
        } else {
            this.incrementStorage(this.stripID(this.checkMiningState(currentObj)))
            this.updateMiningState(currentObj)
        }

        const displayParticles = this.storeMining
        this.EM.publish('display-mined', displayParticles)
}


    checkMiningState(currentObj) {
        const checkedObj = {}
        Object.keys(currentObj).forEach(key => {
            if (!checkedObj[key]) {
                checkedObj[key] = 0
            }
            if (!this.miningStateObj[currentObj.ID][key]) {
                this.miningStateObj[currentObj.ID][key] = 0
            }
            checkedObj[key] = currentObj[key] - this.miningStateObj[currentObj.ID][key]
        })
        return checkedObj
    }


    incrementStorage(particleObj) {
        Object.keys(particleObj).forEach(key => {
            if (!this.storeMining[key]) {
                this.storeMining[key] = 0
            }
            this.storeMining[key] += particleObj[key]
        })
    }


    updateMiningState(currentObj) {
        this.miningStateObj[currentObj.ID] = Object.assign({}, currentObj)
    }


    stripID(currentObj) {
        const particleObj = {}
        Object.keys(currentObj).forEach(key => {
            if (key !== 'ID') {
                particleObj[key] = currentObj[key]
            }
        })
        return particleObj
    }

}

export default new Inventory
