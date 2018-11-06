import eventManager from './eventManager'
import MapGenerator from './MapGenerator'
import Utility from './Utility'


class Map {

    public static getCol(mapData: any) {
        return mapData.length
    }

    public static getRow(mapData: any) {
        return mapData[0].length
    }

    public static generate(obj: any) { // originally this came from destructured { col, row }
        
        const col = obj.col
        const row = obj.row
        const mapGenerator = new MapGenerator()

        return mapGenerator.generate({ col, row})
    }

    public  map: any
    public col: any
    public row: any
    public itemsOnMap: any
    public EM: any
    public character: any


    constructor(mapData: any) {
        // console.log('map constructor', mapData)

        this.map = mapData
        this.col = Map.getCol(mapData)
        this.row = Map.getRow(mapData)

        this.itemsOnMap = []
        this.EM = eventManager
    }

    public getMap() {
        return this.map
    }

    public getMapCenter() {
        return [Math.floor(this.col/2), Math.floor(this.row/2)]
    }

    public getRandomMapLocation() {
        return [Utility.randomize(this.row - 1), Utility.randomize(this.col - 1)]
    }

    public setCharacter(character: any) {
        this.character = character
        this.character.setMap(this.map)
    }

    public setItems(items: any) {
        items.map((item: any) => {
            const randomMapLocation = this.getRandomMapLocation()
            item.setOnMap(this.map, randomMapLocation)
            item.createInitialChildElement('item-layer')  // moved childElement creation out of 'setOnMap'
            this.pushItem(item)
        })
    }

    public pushItem(item: any) {
        this.itemsOnMap.push(item)
    }
}

export default Map
