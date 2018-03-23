import Moveable from './Moveable'


class Item extends Moveable {
    constructor(map, itemObject, generatorIndex) {
        super(map)
        this.item = itemObject
        this.item.type = 'item'
        this.item.offMap = false
        this.initialGridIndices = map.getRandomMapLocation()
        this.setInitialGridIndices(this.initialGridIndices)
        this.setGridIndices()
        this.setCoordinates()

        this.setDiv(generatorIndex)

        this.updateDiv(this.getItem())
        this.createInitialChildElement('item-layer')
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

    setDiv(generatorIndex) {
        this.item.div = this.item.div + generatorIndex
    }

    setEventManager(eventManager) {
        this.EM = eventManager
        this.EM.subscribe(`${this.item.name} taken`, this.onTake, this, true)
    }






    onTake() {
        console.log(`${this.item.name} taken!`)

        this.item.offMap = true  //

        this.renderLayer(this.getItem(), this.item.div)
    }
}


export default Item
