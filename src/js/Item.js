import Moveable from './Moveable'
import Utility from './Utility'
import eventManager from './eventManager'


const ITEMS = {
    miner: {
        name: 'particle miner',
        type: 'item',
        element: '|',
        description: 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.',
        div: 'item-miner'
    }//,
    // parser: {
    //     name: 'noise parser',
    //     type: 'item',
    //     element: '?',
    //     description: 'prototype. parses atmospheric data for latent information. signal-to-noise ratio not guaranteed.',
    //     div: 'item-parser'
    // },
    // interface: {
    //     name: 'psionic interface',
    //     type: 'item',
    //     element: '&',
    //     description: `connects seamlessly to a standard-issue bioport. facilitates sundry interactions performed via PSI-NET.`,
    //     div: 'item-interface'
    // },
    // printer: {
    //     name: 'molecular printer',
    //     type: 'item',
    //     element: '#',
    //     description: 'generates objects according to a blueprint. molecules not included.',
    //     div: 'item-printer'
    // }
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
        this.EM.subscribe(`${this.name}-${this.identityNumber} taken`, this.onTake, this, true)
    }

    setOnMap(map, location) {
        this.setMap(map)
        this.setInitialGridIndices(location)
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
        this.x = null
        this.y = null

        this.EM.publish('add-inventory', this)
        // this.EM.subscribe('remove-inventory', this.onDrop, this)
        this.renderLayer(this, this.div)
    }

    onDrop() {
    //     this.x = args.x
    //     this.y = args.y


        this.EM.subscribe(`${this.name}-${this.identityNumber} taken`, this.onTake, this, true)
    //     this.renderLayer(this, this.div)

    }
}


export default Item
