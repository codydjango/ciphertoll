import Utility from './Utility'
import eventManager from './eventManager'
import MapGenerator from './MapGenerator'

class Map {
    constructor(mapData) {
        console.log('map constructor', mapData)

        this.map = mapData
        this.col = Map.getCol(mapData)
        this.row = Map.getRow(mapData)

        this.itemsOnMap = []
        this.EM = eventManager
    }

    static getCol(mapData) {
        return mapData.length
    }

    static getRow(mapData) {
        return mapData[0].length
    }

    static generate({ col, row }) {
        const mapGenerator = new MapGenerator()

        return mapGenerator.generate({ col, row})
    }

    getMap() {
        return this.map
    }

    getMapCenter() {
        return [Math.floor(this.col/2), Math.floor(this.row/2)]
    }

    getRandomMapLocation() {
        return [Utility.randomize(this.row - 1), Utility.randomize(this.col - 1)]
    }

    setCharacter(character) {
        this.character = character
        this.character.setMap(this.map)
    }

    setItems(items) {
        items.map((item, index) => {
            const randomMapLocation = this.getRandomMapLocation()
            item.setOnMap(this.map, randomMapLocation)
            item.createInitialChildElement('item-layer')  // moved childElement creation out of 'setOnMap'
            this.pushItem(item)
        })
    }

    pushItem(item) {
        this.itemsOnMap.push(item)
    }
}

export default Map
