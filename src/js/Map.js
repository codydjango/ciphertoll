import MapGenerator from './MapGenerator'
import Utility from './Utility'
import eventManager from './eventManager'


class Map {
    constructor(col, row) {
        this.col = col
        this.row = row
        this.generatedMap = new MapGenerator(col, row)
        this.map = this.generatedMap.getMap()
        this.itemsOnMap = []
        this.EM = eventManager
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
            this.pushItem(item)
        })
    }

    pushItem(item) {
        this.itemsOnMap.push(item)
    }

    checkCharacterLocation() {
        const char = this.character.getCharacter()

        this.itemsOnMap.forEach(item => {

            if (item.x === char.x && item.y === char.y) {
                console.log('checkCharacterLocation', char, item)
                this.EM.publish(`on-${item.name}`, item)
                this.EM.publish('item-status', item.name)
            } else {
                this.EM.publish(`off-${item.name}`, item)
            }
        })
    }
}

export default Map
