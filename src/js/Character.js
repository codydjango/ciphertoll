import Moveable from './Moveable'
import { DIRECTIONS } from './constants'


class Character extends Moveable {  // Character data and actions
    constructor(map) {
        super(map)
        this.map = map
        this.EM = null
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
    }

    takeItem() {
        console.log('attempting to take item...')
        this.EM.publish('item taken')
        console.log('events remaining:', this.EM.getEventsList())
    }
}


export default Character
