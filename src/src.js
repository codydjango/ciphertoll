const DIRECTIONS = {
    north: { x: 0, y: -1 },
    south: { x: 0, y: 1 },
    east: { x: 1, y: 0 },
    west: { x: -1, y: 0 },
    northwest: { x: -1, y: -1 },
    northeast: { x: 1, y: -1 },
    southeast: { x: 1, y: 1 },
    southwest: { x: -1, y: 1 }
}

class Utility {
    static contains(obj, property) {
        return Object.keys(obj).indexOf(String(property)) !== -1
    }

    static stringToNumber(string) {
        return string.match(/\d+/)[0]
    }

    static randomize(mult) {
        return Math.floor(Math.random() * mult)
    }
}


class LandscapeSeeds {
    constructor() {
        this.features = this.features()
        this.bare = this.bare()
    }

    features() {
        const period = {
            element: '.',
            description: 'the air is choked with dust, static, wifi',
            probability: 30,
            cls: 'period'
        }
        const comma = {
            element: ',',
            description: 'sprawl of smart homes, cul-de-sacs, laneways',
            probability: 30,
            cls: 'comma'
        }
        const semicolon = {
            element: ';',
            description: 'rows of greenhouses: some shattered and barren, others overgrown',
            probability: 15,
            cls: 'semicolon'
        }
        const grave = {
            element: '^',
            description: 'a shimmering field of solar panels, broken and corroded',
            probability: 15,
            cls: 'grave'
        }
        const asterisk = {
            element: '*',
            description: 'hollow users jack in at the datahubs',
            probability: 15,
            cls: 'asterisk'
        }
        return [period, comma, semicolon, semicolon, asterisk, asterisk, grave, grave]
    }

    bare() {
        const bare = {
            element: '&nbsp;',
            description: 'concrete and twisted rebar stretch to the horizon',
            cls: 'blank'
        }
        return bare
    }
}


class MapGenerator {
    constructor(col, row) {
        console.log('generating map')
        this.landscapeSeeds = new LandscapeSeeds()
        const grid = this.init(col, row)
        const seededGrid = this.seed(grid)
        this.seededGrid = seededGrid
        this.grow()
        console.log('map generated')
    }

    getMap() {
        return this.seededGrid
    }

    init(col, row) {
        this.col = col
        this.row = row
        const grid = []
        for (let i = 0; i < row; i++) {
            grid[i] = []
            for (let j = 0; j < col; j++) {
                grid[i].push(this.landscapeSeeds.bare)
            }
        }
        return grid
    }

    seed(grid) {
        const randomElements = []
        for (let i = 0; i < this.getNumberOfElementSeeds(); i++) {
            randomElements.push(this.landscapeSeeds.features[Utility.randomize(this.landscapeSeeds.features.length)])
        }
        const seeds = this.generateSeedLocations(randomElements)
        seeds.map(seed => grid[seed.x][seed.y] = seed)
        this._seeds = seeds
        return grid
    }

    getNumberOfElementSeeds() {
        //  return 1        // test setting
        // return ((this.col * this.row) / (this._col + this.row))  // sparse initial seeding
        return (this.col + this.row)  // rich initial seeding
    }

    generateSeedLocations(randomElements) {
        return randomElements.map(el => {
            el.x = Utility.randomize(this.row - 1)
            el.y = Utility.randomize(this.col - 1)
            return el
        })
    }

    grow() {
        let seeds = this._seeds
        let mapPopulated = false
        while (mapPopulated === false) {
            if (this.nextGenerationSeeds(seeds).length === 0) {
                mapPopulated = true
            }
            let goodSeeds = []
            this.goodSeeds = goodSeeds
            this.nextGenerationSeeds(seeds).forEach((seed) => {
                if (this.checkSeed(seed) !== null) {
                    goodSeeds.push(this.checkSeed(seed))
                }
            })
            for (let goodSeed of goodSeeds) {
                if (this.seededGrid[goodSeed.x][goodSeed.y] === this.landscapeSeeds.bare) {
                    this.seededGrid[goodSeed.x][goodSeed.y] = goodSeed
                }
            }
            if (this.countUnseededLocations() === 0) {
                mapPopulated = true
            } else {
                seeds = goodSeeds  // feed all goodSeeds back into the grower
            }
        }
    }

    countUnseededLocations() {
        const flattenedGrid = [].concat.apply([], this.seededGrid)
        let count = 0
        for (let i of flattenedGrid) {
            if (i === this.landscapeSeeds.bare) {
                count++
            }
        }
        return count
    }

    checkSeed(seed) {
        let seedSucceeds = false
        if ((seed.x < this.col && seed.x >= 0) &&
            (seed.x < this.row && seed.x >= 0)) {
            seedSucceeds = true
        } else {
            return null
        }
        if (this.seededGrid[seed.x][seed.x] !== this.landscapeSeeds.bare) {
            seedSucceeds = false
        }
        this.goodSeeds.forEach(goodSeed => {
            if ((seed.x === goodSeed.x) &&
                (seed.y === goodSeed.y)) {
                seedSucceeds = false
            }
        })
        if (seedSucceeds === true) {
            return seed
        } else {
            return null
        }
    }

    nextGenerationSeeds(seeds) {
        const nextGenSeeds = []
        seeds.forEach((originalSeed) => {
            for (let direction in DIRECTIONS) {
                const directionValues = DIRECTIONS[direction]
                const nextGenSeed = Object.assign({}, originalSeed)
                if (this.probability(nextGenSeed.probability) === true) {
                    for (let key in directionValues) {
                        if (key === 'x') {
                        nextGenSeed.x = originalSeed.x + directionValues[key]
                        } else if (key === 'y') {
                        nextGenSeed.y = originalSeed.y + directionValues[key]
                        }
                    }
                    nextGenSeeds.push(nextGenSeed)
                }
            }
        })
        this.nextGenSeeds = nextGenSeeds
        return nextGenSeeds
    }

    probability(percentage) {
        const probabilityArray = []
        for (let i = 0; i < percentage; i++) {
            probabilityArray.push(true)
        }
        for (let i = 0; i < 100 - percentage; i++) {
            probabilityArray.push(false)
        }
        return probabilityArray[Utility.randomize(100)]
    }
}


class Map {
    constructor(col, row) {
        this.col = col
        this.row = row
        this.generatedMap = new MapGenerator(col, row)
        this.map = this.generatedMap.getMap()
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



    // updateGridIndices(sprite, move) {  // possibly make a generalized method?
    // }                                  // which then takes 'character' / 'sprite' as input?
    // updateLayer(sprite) {
    // }
    // drawLayer(sprite) {
    // }

}



class Renderable {  // generalized render functions for Scenery, Character
    constructor() {

    }

    setLayer(layer) {
        this.layer = layer
    }

    getLayer() {
        return this.layer
    }

    renderUnit(unit) {      // issue when ITEMS are rendered: multiple items on one layer?
        let cls = ''
        let element = '&nbsp;'
        if (unit) {
            cls = unit.cls
            element = unit.element
        }
        let style = ''
        if (unit.top && unit.left) {
            style = `top: ${unit.top}px; left: ${unit.left}px`
        }
        return `<span class="unit ${cls}" style="${style}">${element}</span>`
    }
}


class Scenery extends Renderable {  // Scenery-specific rendering functions
    constructor(map) {
        super()
        this.map = map.getMap()
        this.renderLayer()
        console.log('scenery rendered')
    }

    renderLayer() {
        const grid = this.map.map(arr => { return arr.slice() })
        this.setLayer(this.createLayer(grid))
        this.drawLayer()
    }

    createLayer(grid) {
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

    drawLayer() {
        const layer = this.getLayer()
        const gridToHTML = layer.join('<br />')  // using HTML breaks for now
        const el = document.getElementById('landscape-layer')
        el.innerHTML = gridToHTML
    }
}


class Moveable extends Renderable {  // movement and placement on the grid
    constructor(map) {
        super()
        this.map = map.getMap()
    }

    createMoveableLayer(moveableObject) {
        return this.renderUnit(moveableObject)
    }

    updateLayer(moveableObject) {
        this.setLayer(this.createMoveableLayer(moveableObject))
    }

    drawLayer(layerId) {
        const el = document.getElementById(layerId)
        el.innerHTML = this.getLayer();
    }

    renderLayer(moveableObject, layerId) {
        this.updateLayer(moveableObject)
        this.drawLayer(layerId)
    }

    setInitialGridIndices(gridIndices) {
        this.gridIndices = gridIndices
        const location = this.map[this.gridIndices[1]][this.gridIndices[0]]
    }

    getCSSCoordinates() {
        const css = this.getCSSHeightAndWidth()
        const x = this.gridIndices[0] * css.height
        const y = this.gridIndices[1] * css.width
        return { x, y }
    }

    getGridIndices() {
        const x = this.gridIndices[0]
        const y = this.gridIndices[1]
        return { x, y }
    }

    getCSSHeightAndWidth() {
        const el = document.querySelector('.unit')
        const style = window.getComputedStyle(el)
        const width = Utility.stringToNumber(style.getPropertyValue('width'))
        const height = Utility.stringToNumber(style.getPropertyValue('height'))
        return { width, height }
    }

    updateGridIndices(move) {
        const newGridIndices = [this.gridIndices[0] + move.x, this.gridIndices[1] + move.y]
        let location = ''
        if (this.checkGridIndices(newGridIndices)) {
            location = this.map[newGridIndices[1]][newGridIndices[0]]
            this.gridIndices = newGridIndices
        } else {
            location = this.map[this.gridIndices[1], this.gridIndices[0]]
            // console.log("you've reached the map's edge")
        }
        return location
    }

    checkGridIndices(newGridIndices) {
        let locationOnGrid = false
        if (this.map[newGridIndices[1]]) {
            const location = this.map[newGridIndices[1]][newGridIndices[0]]
            if (location) {
                locationOnGrid = true
            }
        }
        return locationOnGrid
    }
}


class Character extends Moveable {  // Character data and actions
    constructor(map) {
        super(map)
        this.initialGridIndices = map.getMapCenter()

        this.setInitialGridIndices(this.initialGridIndices)
        this.renderLayer(this.getCharacter(), 'character-layer')
        console.log('character rendered')
    }

    getCharacter() {
        const { x, y } = this.getCSSCoordinates()
        const character = {
            element: '@',
            cls: 'character',
            top: y,
            left: x
        }
        return character
    }

    getAction(fnName, arg) {
        return this[fnName].bind(this, arg)
    }

    move(direction) {
        // console.log(`${direction}`)
        const location = this.updateGridIndices(DIRECTIONS[direction])
        console.log(`${location.description}`)
        this.renderLayer(this.getCharacter(), 'character-layer')
    }

    grabItem(item) {

    }


}



class Item extends Moveable {
    constructor(map, itemObject) {
        super(map)
        this.initialGridIndices = map.getRandomMapLocation()

        this.setInitialGridIndices(this.initialGridIndices)
        this.renderLayer(this.getItem(itemObject), 'item-layer')
        console.log(`item ${itemObject.name} rendered at ${this.initialGridIndices}`)
    }

    getItem(itemObject) {
        console.log('itemObject', itemObject)
        const { x, y } = this.getCSSCoordinates()
        itemObject.top = y
        itemObject.left = x
        return itemObject
    }

}


class ItemGenerator {
    constructor(map, numberOfItems) {
        this.map = map
        this.numberOfItems = numberOfItems
        this.data = new ItemData()
        this.generateItems()
    }

    getRandomItems() {
        const allItems = this.data.items
        const randomItems = []
        for (let i = 0; i < this.numberOfItems; i++) {
            const randomItem = allItems[Utility.randomize(allItems.length)]
            randomItems.push(randomItem)
        }
        return randomItems
    }

    generateItems() {
        const randomItems = this.getRandomItems()
        randomItems.forEach(item => {
            const newItem = new Item(this.map, item)
            console.log('newItem', newItem)
        })
    }

}

class ItemData {
    constructor() {
        this.items = this.items()
    }

    items() {
        const miner = {
            name: 'miner',
            element: '|',
            description: '',
            cls: 'item miner'
        }
        const cybernesion = {
            name: 'cybernesion',
            element: '?',
            description: '',
            cls: 'item cybernesion'
        }
        const artificialMuscle = {
            name: 'artificialMuscle',
            element: '&',
            description: '',
            cls: 'item artificialMuscle'
        }
        const printer = {
            name: 'printer',
            element: '#',
            description: '',
            cls: 'item printer'
        }
        return [miner, cybernesion, artificialMuscle, printer]
    }
}




class Game {
    constructor() {
        this.initGame()
        this.startGame()
    }

    initGame() {
        this.spaces = []
        this.gameOver = false
        this.map = new Map(60, 60)
        this.scenery = new Scenery(this.map)
        this.character = new Character(this.map)

        // try generating from a set of stock items
        // bug: only the last item generated will display!!
        this.itemGenerator= new ItemGenerator(this.map, 5)

        this.map.setCharacter(this.character)  // gives map reference to character

        this.input = this.initUserInput()
    }

    initUserInput() {
        return new UserInput({
            '38': this.character.getAction('move', 'north'),
            '37': this.character.getAction('move', 'west'),
            '39': this.character.getAction('move', 'east'),
            '40': this.character.getAction('move', 'south'),
            '71': this.character.getAction('grabItem', 'item')
        })
    }

    startGame() {
        console.log('start!')
    }

    gameIsOver() {
        return this.gameOver
    }

    explore() {
        console.log(`exploring the ${this.kind} zone!`)
    }
}


class UserInput {
    constructor(keyActionMap) {
        this.keyActionMap = keyActionMap

        document.onkeydown = this.tryActionForEvent.bind(this)
    }

    tryActionForEvent(event) {
        if (!Utility.contains(this.keyActionMap, event.keyCode)) {
            console.log(`not a valid keycode: ${event.keyCode}`)
        } else {
            this.keyActionMap[event.keyCode]()
        }
    }
}


window.game = new Game()




//     giveOptionForAction() {
        // if (window.prompt('Exit?', 'Sure') === 'Sure') {
            // this.gameOver = true
        // }

        // actions could have constraints, such as
        //     -only can take one action of this type at a time
        //     - action requires cooldown
        //     - action requires prep
        //     - action costs resources


        // ask player for action
        // process action
        // calculate stats
    // }
