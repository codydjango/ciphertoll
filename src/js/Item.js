import Moveable from './Moveable'
import Utility from './Utility'
import eventManager from './eventManager'


const ITEMS = {
    particleMiner: {
        name: 'particle miner',
        type: 'item',
        element: '|',
        description: '',
        div: 'item-miner'
    },
    noiseParser: {
        name: 'noise parser',
        type: 'item',
        element: '?',
        description: '',
        div: 'item-parser'
    },
    psionicInterface: {
        name: 'psionic interface',
        type: 'item',
        element: '&',
        description: '',
        div: 'item-interface'
    },
    molecularPrinter: {
        name: 'molecular printer',
        type: 'item',
        element: '#',
        description: '',
        div: 'item-printer'
    }
}

class Item extends Moveable {
    static getRandomItemConfig() {
        const allItems = Object.values(ITEMS)
        return allItems[Utility.randomize(allItems.length)]
    }

    static random() {
        return new Item(Item.getRandomItemConfig())
    }

    static generate(number) {
        const items = []
        for (let i = 0; i < number; i++) {
            items.push(Item.random())
        }

        return items
    }

    constructor(itemConfig) {
        super()

        // merge in config properties
        const target = Object.assign(this, itemConfig)

        // additional properties
        this.identityNumber = Utility.Id()
        this.type = 'item'
        this.offMap = false
        this.inInventory = false

        this.EM = eventManager
        this.EM.subscribe(`${this.name} taken`, this.onTake, this, true)
    }

    setOnMap(map, randomMapLocation) {
        this.setMap(map)
        this.setInitialGridIndices(randomMapLocation)
        this.setCoordinates()
        this.setGridIndices()
        this.setDiv(this.getId())
        this.updateDiv(this)
        this.createInitialChildElement('item-layer')
    }

    getId() {
        return this.identityNumber
    }

    setCoordinates() {
        const { cssLeft, cssTop } = this.getCSSCoordinates()
        this.left = cssLeft
        this.top = cssTop
    }

    setGridIndices() {
        const { x, y } = this.getGridIndices()

        this.x = x
        this.y = y
    }

    setDiv(identityNumber) {
        this.div = this.div + identityNumber
    }

    onTake() {
        console.log(`${this.name} taken!`)

        this.offMap = true  //
        this.inInventory = true

        this.x = null
        this.y = null

        this.EM.publish('add-inventory', this.item)

        this.renderLayer(this, this.div)
    }
}


export default Item
