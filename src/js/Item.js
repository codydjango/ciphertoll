import Moveable from './Moveable'


class Item extends Moveable {
    constructor(map, itemObject) {
        super(map)
        this.item = itemObject
        this.initialGridIndices = map.getRandomMapLocation()
        this.setInitialGridIndices(this.initialGridIndices)
        this.setGridIndices()
        this.setCoordinates()



        // this.setLayer(this.renderUniqueItemDiv(this.getItem()))
        // this.drawLayer('item-layer')


        this.renderLayer(this.getItem(), 'item-layer')  // issues with rendering multiple items



        console.log(`item ${this.item.name} rendered at ${this.initialGridIndices}`)

    }


    // renderUniqueItemDiv(item) {
    //     let element = '&nbsp;'
    //     let style = ''
    //     if (item) {
    //         cls = item.cls
    //         element = item.element
    //     }
    //     if (item.top && item.left) {
    //         style = `top: ${item.top}px; left: ${item.left}px`
    //     }
    //     console.log(`<div id="${cls}" style="${style}">${element}</div>`)
    //     return `<div id="${cls}" style="${style}">${element}</div>`
    // }





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
        this.EM.subscribe(`${this.item.name} taken`, this.onTake, this, true)
        // console.log('events list', this.EM.getEventsList())
    }

    onTake() {
        console.log(`${this.item.name} taken!`)
    }
}


export default Item
