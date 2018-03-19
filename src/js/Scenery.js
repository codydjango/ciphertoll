import Renderable from './Renderable'


class Scenery extends Renderable {  // Scenery-specific rendering functions
    constructor(map) {
        super()
        this.gotMap = map.getMap()
        this.renderGridLayer()
        console.log('scenery rendered')
    }

    renderGridLayer() {
        const grid = this.gotMap.map(arr => { return arr.slice() })
        this.setLayer(this.createGridLayer(grid))
        this.drawGridLayer()
    }

    createGridLayer(grid) {
        const sceneryGrid = []
        for (let i = 0; i < grid.length; i++) {
            const rowItems = grid[i]
            let row = ''  // possibly make each row a table?
            for (let i = 0; i < rowItems.length; i++) {
                row += this.renderUnit(rowItems[i]) // add rendered items to the grid
            }
            sceneryGrid.push(row)
        }
        return sceneryGrid
    }

    drawGridLayer() {
        const layer = this.getLayer()
        const gridToHTML = layer.join('<br />')  // using HTML breaks for now
        const el = document.getElementById('landscape-layer')
        el.innerHTML = gridToHTML
    }
}


export default Scenery
