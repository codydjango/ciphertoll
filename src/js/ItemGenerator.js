import ItemData from './ItemData'
import Utility from './Utility'
import Item from './Item'


class ItemGenerator {
    constructor(map, eventManager, numberOfItems) {
        this.map = map
        this.numberOfItems = numberOfItems
        this.data = new ItemData()
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


// issues with items overwriting one another...
    generateItems() {
        const randomItems = this.getRandomItems()

        // for (let i = 0; i < randomItems.length; i++) {
        //     this.newItem = new Item (this.map, randomItems[i], i)
        //     console.log('ITEMGENERATOR.GENERATEITEMS: item x', this.newItem.item.x, 'item y', this.newItem.item.y)
        //     this.newItem.setEventManager(this.EM)
        //     this.map.pushItem(this.newItem.item)
        //     console.log('ITEMGENERATOR after PUSHITEM: item x', this.newItem.item.x, 'item y', this.newItem.item.y)
        //     console.log('item generated:', this.newItem.item)
        //     }

        randomItems.forEach((item, index) => {
            this.newItem = new Item(this.map, item, index)
            console.log('ITEMGENERATOR.GENERATEITEMS: item x', this.newItem.item.x, 'item y', this.newItem.item.y)
            this.newItem.setEventManager(this.EM)
            this.map.pushItem(this.newItem.item)
            console.log('ITEMGENERATOR after PUSHITEM: item x', this.newItem.item.x, 'item y', this.newItem.item.y)
            console.log('item generated:', this.newItem.item) // but here, object itself contains only newest generated location???
        })
    }
}


export default ItemGenerator
