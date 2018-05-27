import eventManager from './eventManager'

class Inventory {
    constructor() {
        this.contents = []

        eventManager.subscribe('add-inventory', this.add, this)
        eventManager.subscribe('remove-inventory', this.remove, this)
        eventManager.subscribe('reset', this.clear, this)
    }

    clear() {
        this.contents = []
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
        eventManager.publish('display-inventory', this.contents)
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
