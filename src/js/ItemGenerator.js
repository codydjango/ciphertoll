import ItemData from './ItemData'
import Utility from './Utility'
import Item from './Item'


class ItemGenerator {
    constructor(map, eventManager, numberOfItems) {
        this.map = map
        this.numberOfItems = numberOfItems
        this.data = new ItemData()

        // eventmanager testing

        this.EM = eventManager

        this.generateItems()
    }

    getRandomItems() {
        const allItems = this.data.items
        const randomItems = []
        for (let i = 0; i < this.numberOfItems; i++) {
            const randomItem = allItems[Utility.randomize(allItems.length)]
            randomItems.push(randomItem)
        }
        return randomItems
    }

    generateItems() {
        const randomItems = this.getRandomItems()
        randomItems.forEach(item => {
            this.newItem = new Item(this.map, item)

            // eventmanager testing

            this.newItem.setEventManager(this.EM)

            this.map.pushItem(this.newItem.item)  // hmmm... pushItems refreshes each time generateItems is called?
            console.log('item generated:', this.newItem.item)
        })
    }
}


export default ItemGenerator
