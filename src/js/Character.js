import Moveable from './Moveable'
import { DIRECTIONS } from './Constants'
import eventManager from './eventManager'
import inventory from './inventory'


class Character extends Moveable {  // Character data and actions
    constructor(map) {
        super(map)
        this.map = map
        this.EM = eventManager
        this.inventory = inventory.contents
        this.initialGridIndices = map.getMapCenter()
        this.setInitialGridIndices(this.initialGridIndices)
        this.renderLayer(this.getCharacter(), 'character-layer')
        console.log('character rendered')
    }

    renderLayer(unit, layerId) {
        if (unit.type === 'actor') {
            this.updateSpan(unit)
            this.drawLayer(layerId)
        }
    }

    subscribeItemsToMap() {
        // NOT REQUIRED AT THE MOMENT

        // this.map.itemsOnMap.forEach(item => {
        //     this.EM.subscribe(`${item.name}-${item.identityNumber} taken`, this.takeItem, this, true)
        // })
    }

    getCharacter() {
        const { cssLeft, cssTop } = this.getCSSCoordinates()
        const { x, y } = this.getGridIndices()
        const character = {
            name: 'character',
            type: 'actor',
            element: '@',
            cls: 'character',
            left: cssLeft,
            top: cssTop,
            x: x,
            y: y
        }
        return character
    }

    getAction(fnName, arg) {
        return this[fnName].bind(this, arg)
    }

    move(direction) {
        this.location = this.updateGridIndices(this.getCharacter(), DIRECTIONS[direction])
        this.printLocalStatus()
        this.renderLayer(this.getCharacter(), 'character-layer')
    }

    printLocalStatus() {
        this.EM.publish('character-moved', this.location)
        const localItem = this.localItem()
        if (localItem) {
            if (localItem.mining) {
                this.EM.publish('status', 'a miner pulls compounds from the region')
            } else {
                this.EM.publish('display-item', localItem.name)
            }
        }
    }

    localItem() {
        const char = this.getCharacter()
        let localItem = null
        this.map.itemsOnMap.forEach(item => {
            if (item.x === char.x && item.y === char.y) {
                localItem = item
            }})
        return localItem
    }


    take() {
        const localItem = this.localItem()
        if (localItem) {
            this.EM.publish(`${localItem.name}-${localItem.identityNumber} taken`)
            this.EM.publish('status', `${localItem.name} taken`)
        } else {
            this.EM.publish('status', 'there is nothing here worth taking')
        }
    }


    checkInventory() {
        const carrying = this.inventory.map(item => item.name).join(' | ')
        const text = `you are carrying: ${carrying}`
        this.EM.publish('status', text)
    }


    findInventoryItem(itemName) {
        let foundItem = null
        this.inventory.forEach(item => {
            if (item.name === itemName) {
                foundItem = item
            }
        })
        return foundItem
    }

    mine() {

        const char = this.getCharacter()
        const miner = this.findInventoryItem('particle miner')
        const location = [char.x, char.y]


        if (miner) {
            miner.offMap = false
            miner.mining = true
            miner.spinning = true
            miner.setOnMap(this.map.map, location)
            miner.drawLayer(miner.div)
            this.EM.publish('remove-inventory', miner)

        } else {

            this.EM.publish('status', 'you do not have any particle miners')

        }

    }


}


export default Character
