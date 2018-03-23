import MapGenerator from './MapGenerator'
import Utility from './Utility'


class Map {
    constructor(col, row) {
        this.col = col
        this.row = row
        this.generatedMap = new MapGenerator(col, row)
        this.map = this.generatedMap.getMap()
        this.itemsOnMap = []
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
    }

    setEventManager(eventManager) {
        this.EM = eventManager
    }

    pushItem(item) {
        this.itemsOnMap.push(item)
        // console.log('itemsOnMap', this.itemsOnMap)
    }

    checkCharacterLocation() {
        const char = this.character.getCharacter()
        this.itemsOnMap.forEach(item => {
            if (item.x === char.x && item.y === char.y) {
                this.EM.publish(`on-${item.name}`, item)
            } else {
                this.EM.publish(`off-${item.name}`, item)
            }
        })
    }
}

export default Map
