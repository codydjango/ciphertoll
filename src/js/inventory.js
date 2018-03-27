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
        this.contents.forEach((item, i) => {
            if (this.contents[i].item === item) {
                this.contents.splice(i, 1)
            } else {
                // item not in inventory
            }})

    }

}

export default new Inventory
