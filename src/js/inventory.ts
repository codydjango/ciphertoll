import eventManager from './eventManager'

class Inventory {

    public contents: any

    constructor() {
        this.contents = []

        eventManager.subscribe('add-inventory', this.add, this)
        eventManager.subscribe('remove-inventory', this.remove, this)
        eventManager.subscribe('reset', this.clear, this)
    }

    public clear() {
        this.contents = []
    }

    public add(item: any) {
        this.contents.push(item)
        this.update()
    }

    public remove(itemtoRemove: any) {
        this.contents.forEach((item: any, i: any, array: any) => {
            if (array[i] === itemtoRemove) {
                this.contents.splice(i, 1)
                console.log('inventory item removed', item)
                this.update()
            }})
    }

    public update() {
        eventManager.publish('display-inventory', this.contents)
    }

    public retrieveItem(itemName: any) {
        let retrieved = null
        this.contents.forEach((item: any) => {
            if (item.name === itemName) {
                retrieved = item
            }
        })
        return retrieved
    }
}

export default new Inventory
