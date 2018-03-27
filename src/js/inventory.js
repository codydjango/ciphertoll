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
    }



// untested

    remove(item) {
        const theItem = item
        this.contents.forEach((item, i, array) => {
            if (array[i] === theItem) {
                this.contents.splice(i, 1)
            // } else {
                // console.log('item not in inventory')
            }})

    }

}

export default new Inventory
