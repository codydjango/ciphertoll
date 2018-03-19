import Moveable from './Moveable'


class Item extends Moveable {
    constructor(map, itemObject) {
        super(map)
        this.item = itemObject
        this.initialGridIndices = map.getRandomMapLocation()
        this.setInitialGridIndices(this.initialGridIndices)
        this.setGridIndices()
        this.setCoordinates()


        this.renderLayer(this.getItem(), 'item-layer')  // issues with rendering multiple items

        console.log(`item ${this.item.name} rendered at ${this.initialGridIndices}`)

    }

    getItem() {
        return this.item
    }

    setCoordinates() {
        const { cssLeft, cssTop } = this.getCSSCoordinates()
        this.item.left = cssLeft
        this.item.top = cssTop
    }

    setGridIndices() {
        this.item.x = this.gridIndices[0]
        this.item.y = this.gridIndices[1]
    }

    // eventmanager testing

    setEventManager(eventManager) {
        this.EM = eventManager
        this.EM.subscribe('item taken', this.onTake, this)
        console.log('events list', this.EM.getEventsList())
    }

    onTake() {
        console.log(`${this.item.name} taken!`)
    }
}


export default Item
