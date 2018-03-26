import eventManager from './eventManager'

class Inventory {
    constructor(blueprint) {
        this.blueprint = blueprint
        this.inventory = [this.blueprint]
        console.log('inventory', this.inventory)

        this.EM = eventManager
        this.EM.subscribe('add-inventory', this.add, this)
        this.EM.subscribe('remove-inventory', this.remove, this)
    }

    add(item) {
        this.inventory.push(item)
        console.log('inventory', this.inventory)
    }



// untested

    remove(item) {
        this.inventory.forEach((item, i) => {
            if (this.inventory[i].item === item) {
                this.inventory.splice(i, 1)
            } else {
                // item not in inventory
            }})

    }

}

export default Inventory
