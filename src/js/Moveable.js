import Renderable from './Renderable'
import Utility from './Utility'


class Moveable extends Renderable {  // movement and placement on the grid
    constructor(map) {
        super()
        this.gotMap = map.getMap()
    }

    setInitialGridIndices(gridIndices) {
        this.gridIndices = gridIndices
        const location = this.gotMap[this.gridIndices[1]][this.gridIndices[0]]
    }

    getGridIndices() {
        const x = this.gridIndices[0]
        const y = this.gridIndices[1]
        return { x, y }
    }

    updateGridIndices(actor, move) {
        const newGridIndices = [this.gridIndices[0] + move.x, this.gridIndices[1] + move.y]
        let location = ''
        if (this.checkGridIndices(newGridIndices)) {
            location = this.gotMap[newGridIndices[1]][newGridIndices[0]]
            this.gridIndices = newGridIndices
            actor.x = newGridIndices[0]
            actor.y = newGridIndices[1]
        } else {
            location = this.gotMap[this.gridIndices[1], this.gridIndices[0]]
            if (actor.name === 'character') {
                console.log("you've reached the map's edge")
            }
        }
        return location
    }

    checkGridIndices(newGridIndices) {
        let locationOnGrid = false
        if (this.gotMap[newGridIndices[1]]) {
            const location = this.gotMap[newGridIndices[1]][newGridIndices[0]]
            if (location) {
                locationOnGrid = true
            }
        }
        return locationOnGrid
    }

    getCSSHeightAndWidth() {
        const el = document.querySelector('.unit')
        const style = window.getComputedStyle(el)
        const width = Utility.stringToNumber(style.getPropertyValue('width'))
        const height = Utility.stringToNumber(style.getPropertyValue('height'))
        return { width, height }
    }

    getCSSCoordinates() {
        const css = this.getCSSHeightAndWidth()
        const cssLeft = this.gridIndices[0] * css.height
        const cssTop = this.gridIndices[1] * css.width
        return { cssLeft, cssTop }
    }
}


export default Moveable
