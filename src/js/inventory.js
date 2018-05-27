import eventManager from './eventManager'

class Inventory {
    constructor() {
        this.contents = []
        this.EM = eventManager
        this.EM.subscribe('add-inventory', this.add, this)
        this.EM.subscribe('remove-inventory', this.remove, this)
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

    retrieveItem(itemName) {
        let retrieved = null
        this.contents.forEach(item => {
            if (item.name === itemName) {
                retrieved = item
            }
        })
        return retrieved
    }
}

export default new Inventory
