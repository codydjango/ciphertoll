import Renderable from './Renderable'


class Scenery extends Renderable {  // Scenery-specific rendering functions
    
    public map: any

    constructor(map: any) {
        super()
        this.map = map.getMap()
        this.renderLayer()
        console.log('scenery rendered')
    }

    public renderLayer() {
        const grid = this.map.map((arr: any) => arr.slice())
        this.setLayer(this.createLayer(grid))
        this.drawLayer()
    }

    // old version, linter does not like simple for loops

    // public createLayer(grid: any) {
    //     const sceneryGrid = []
    //     for (let i = 0; i < grid.length; i++) {
    //         const rowItems = grid[i]
    //         let row = ''  // possibly make each row a table?
    //         for (let i = 0; i < rowItems.length; i++) {
    //             row += this.renderSpan(rowItems[i]) // add rendered items to the grid
    //         }
    //         sceneryGrid.push(row)
    //     }
    //     return sceneryGrid
    // }



    // try with for ... of
    public createLayer(grid: any) {
        const sceneryGrid: any = []
        grid.forEach((item: any, i: any) => {
            const rowItems = grid[i]
            console.log("rowItems", rowItems)
            let row = ''  // possibly make each row a table?
            rowItems.forEach((element: any, j: any) => {
                row += this.renderSpan(rowItems[j]) // add rendered items to the grid
            })
            sceneryGrid.push(row)
            
        });


        
        console.log("scenery", sceneryGrid)
        return sceneryGrid
    }

    public drawLayer() {
        const layer = this.getLayer()
        console.log("draw layer", layer)

        const gridToHTML = layer.join('<br />')  // using HTML breaks for now
        const el = document.getElementById('landscape-layer')!
        el.innerHTML = gridToHTML
    }
}


export default Scenery
