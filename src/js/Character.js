import Moveable from './Moveable'
import { DIRECTIONS } from './Constants'


class Character extends Moveable {  // Character data and actions
    constructor(map) {
        super(map)
        this.map = map
        this.EM = null
        this.item = null

        this.initialGridIndices = map.getMapCenter()

        this.setInitialGridIndices(this.initialGridIndices)
        this.renderLayer(this.getCharacter(), 'character-layer')
        console.log('character rendered')
    }

    getCharacter() {
        const { cssLeft, cssTop } = this.getCSSCoordinates()
        const { x, y } = this.getGridIndices()
        const character = {
            name: 'character',
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
        // console.log(`${direction}`)
        this.location = this.updateGridIndices(this.getCharacter(), DIRECTIONS[direction])
        // const char = this.getCharacter()
        // console.log('location', this.location)
        this.map.checkCharacterLocation()

        if (this.EM) {
            this.EM.publish('character-moved', this.location)
        }

        this.renderLayer(this.getCharacter(), 'character-layer')
    }

    // eventmanager testing
    setEventManager(eventManager) {
        this.EM = eventManager
        console.log('character knows about items', this.map.itemsOnMap)
        this.map.itemsOnMap.forEach(item => {
            this.EM.subscribe(`on-${item.name}`, this.onItem, this, true)
            this.EM.subscribe(`take-${item.name}`, this.takeItem, this, true)

        })
    }

    onItem(item) {
        console.log(`character is at ${item.name}!`)
        item.takeable = true
        this.item = item
        this.EM.subscribe(`off-${item.name}`, this.offItem, this, true)
    }

    offItem(item) {
        this.item = item
        console.log(`character is no longer on ${this.item.name}`)
        this.EM.subscribe(`on-${item.name}`, this.onItem, this, true)
        this.item = null
    }

    take() {
        console.log('attempting to take item...')
        if (this.item) {
            this.EM.publish(`take-${this.item.name}`, this.item)
        } else {
            console.log('nothing to take!')
        }
    }

    takeItem(item) {
        if (item.takeable) {
            this.EM.publish(`${item.name} taken`)
            // console.log('events remaining:', this.EM.getEventsList())
        }
    }
}


export default Character
