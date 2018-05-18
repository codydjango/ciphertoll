
import eventManager from './eventManager'

class MiningInventory {
    constructor() {
        this.EM = eventManager
        this.EM.subscribe('add-mined', this.addMined, this)
        this.storeMining = {}
        this.miningStateObj = {}
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

export default new MiningInventory
