import Moveable from './Moveable'
import { DIRECTIONS } from './Constants'
import eventManager from './eventManager'
import inventory from './inventory'


class Character extends Moveable {  // Character data and actions
    constructor(mapInstance, initialPosition) {
        super(mapInstance)

        this.mapInstance = mapInstance
        this.initialPosition = initialPosition

        this.initSettings()
        this.render()

        console.log('character rendered')
    }

    initSettings() {
        this.EM = eventManager
        this.inventory = inventory
        this.setInitialGridIndices(this.getPosition())
    }

    render() {
        this.updateSpan(this.getCharacter())
        this.drawLayer('character-layer')
    }

    getPosition() {
        let position
        this.initialPosition ? position = this.initialPosition : position = this.mapInstance.getMapCenter()
        return position
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

        console.log('this.location', this.location)

        const position = {
            x: this.location.x,
            y: this.location.y
        }

        this.EM.publish('moved-to', position)
    }

    printLocalStatus() {
        this.EM.publish('character-moved', this.location)
        const localItem = this.getLocalItem()

        if (localItem) {
            if (localItem.mining === 'empty') {
                this.EM.publish('status', 'mining has been exhausted for this region')
            } else if (localItem.mining) {
                this.EM.publish('status', 'a miner pulls compounds from the region')
            } else {
                this.EM.publish('display-item', localItem.name)
            }
        }
    }

    getLocalItem() {
        const char = this.getCharacter()
        let localItem = null
        this.mapInstance.itemsOnMap.forEach(item => {
            if (item.x === char.x && item.y === char.y) {
                localItem = item
            }})
        return localItem
    }

    take() {
        const localItem = this.getLocalItem()

        if (localItem) {
            this.EM.publish(`${localItem.name}-${localItem.identityNumber} taken`)
            this.EM.publish('status', `${localItem.name} taken`)
        } else {
            this.EM.publish('status', 'there is nothing here worth taking')
        }
    }

    getItemLocation(itemName) {
        const char = this.getCharacter()
        const itself = this.inventory.retrieveItem(itemName)
        const location = [char.x, char.y]
        return { itself, location }
    }

    mine() {
        const miner = this.getItemLocation('particle miner')
        if (miner.itself) {
            miner.itself.mine(miner.location)
            this.EM.publish('remove-inventory', miner.itself)
        } else {
            this.EM.publish('status', 'you do not have any particle miners')
        }
    }
}


export default Character
