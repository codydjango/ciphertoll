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
        seeds.map(seed => grid[seed.y][seed.x] = seed)
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
        while (!mapPopulated) {
            if (!this.nextGenerationSeeds(seeds).length) {
                mapPopulated = true
            }
            let goodSeeds = []
            this.goodSeeds = goodSeeds
            this.nextGenerationSeeds(seeds).forEach((seed) => {
                if (this.checkSeed(seed)) {
                    goodSeeds.push(this.checkSeed(seed))
                }
            })
            for (let goodSeed of goodSeeds) {
                if (this.seededGrid[goodSeed.y][goodSeed.x] === this.landscapeSeeds.bare) {
                    this.seededGrid[goodSeed.y][goodSeed.x] = goodSeed
                }
            }
            if (!this.countUnseededLocations()) {
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
            (seed.y < this.row && seed.y >= 0)) {
            seedSucceeds = true
        } else {
            return null
        }
        if (this.seededGrid[seed.y][seed.x] !== this.landscapeSeeds.bare) {
            seedSucceeds = false
        }
        this.goodSeeds.forEach(goodSeed => {
            if ((seed.x === goodSeed.x) &&
                (seed.y === goodSeed.y)) {
                seedSucceeds = false
            }
        })
        if (seedSucceeds) {
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
                if (this.probability(nextGenSeed.probability)) {
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





    // generate list of all items currently located on the map
    // currently only works for one item??


    pushItems(item) {
        this.itemsOnMap = []
        this.itemsOnMap.push(item)
        console.log('itemsOnMap', this.itemsOnMap)
    }



        // if character is on the same location as an item,
        //     print item description
        //     allow character to interact with item


    checkCharacterLocation() {
        const char = this.character.getCharacter()
        this.itemsOnMap.forEach(item => {
            // console.log('character grid location:', [char.x, char.y])
            // console.log('item grid location:', [item.x, item.y])
            if (item.x === char.x &&
                item.y === char.y) {
                console.log('character is at item!')
            }
        })
    }

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
        this.gotMap = map.getMap()
        this.renderLayer()
        console.log('scenery rendered')
    }

    renderLayer() {
        const grid = this.gotMap.map(arr => { return arr.slice() })
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
        this.gotMap = map.getMap()
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
        const location = this.gotMap[this.gridIndices[1]][this.gridIndices[0]]
    }

    getCSSCoordinates() {
        const css = this.getCSSHeightAndWidth()
        const cssLeft = this.gridIndices[0] * css.height
        const cssTop = this.gridIndices[1] * css.width
        return { cssLeft, cssTop }
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
}


class Character extends Moveable {  // Character data and actions
    constructor(map) {
        super(map)
        this.map = map
        this.initialGridIndices = map.getMapCenter()

        this.setInitialGridIndices(this.initialGridIndices)
        this.renderLayer(this.getCharacter(), 'character-layer')
        console.log('character rendered')
    }

    getCharacter() {
        const { cssLeft, cssTop } = this.getCSSCoordinates()
        const { x, y } = this.getGridIndices()
        const character = {
            name: 'character',
            element: '@',
            cls: 'character',
            left: cssLeft,
            top: cssTop,
            x: x,
            y: y
        }
        return character
    }



    getAction(fnName, arg) {
        return this[fnName].bind(this, arg)
    }

    move(direction) {
        // console.log(`${direction}`)
        this.location = this.updateGridIndices(this.getCharacter(), DIRECTIONS[direction])

        const char = this.getCharacter()


        console.log('location', this.location)
        this.map.checkCharacterLocation()
        this.printLocation()
        this.renderLayer(this.getCharacter(), 'character-layer')
    }

    printLocation() {
        if (this.location.description) {
            console.log(`${this.location.description}`)
        }
    }


    // eventmanager testing

    setEM(eventManager) {
        this.EM = eventManager
    }

    takeItem() {
        console.log('attempting to take item...')
        this.EM.publish('item_taken')
        console.log(this.EM.getEventsList())

    }


}



class Item extends Moveable {
    constructor(map, itemObject) {
        super(map)
        this.item = itemObject
        this.initialGridIndices = map.getRandomMapLocation()
        this.setInitialGridIndices(this.initialGridIndices)
        this.setGridIndices()
        this.setCoordinates()


        this.renderLayer(this.getItem(), 'item-layer')  // issues with rendering multiple items

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


    // eventmanager testing

    setEM(eventManager) {
        this.EM = eventManager
        this.EM.subscribe('item_taken', this.onTake, this)
        console.log(this.EM.getEventsList())
    }

    onTake() {
        console.log(`${this.item.name} taken!`)
    }
}


class ItemGenerator {
    constructor(map, eventManager, numberOfItems) {
        this.map = map
        this.numberOfItems = numberOfItems
        this.data = new ItemData()

        // eventmanager testing

        this.EM = eventManager

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
            this.newItem = new Item(this.map, item)


            // eventmanager testing

            this.newItem.setEM(this.EM)

            this.map.pushItems(this.newItem.item)  // hmmm... pushItems refreshes each time generateItems is called?
            console.log('item generated:', this.newItem.item)
        })
    }
}


class ItemData {
    constructor() {
        this.items = this.items()
    }

    items() {
        const particleMiner = {
            name: 'particle miner',
            element: '|',
            description: '',
            cls: 'item miner'
        }
        const blueprint = {
            name: 'blueprint',
            element: '?',
            description: '',
            cls: 'item blueprint'
        }
        const artificialMuscle = {
            name: 'artificial muscle',
            element: '&',
            description: '',
            cls: 'item muscle'
        }
        const printer = {
            name: '3D printer',
            element: '#',
            description: '',
            cls: 'item printer'
        }
        return [particleMiner, blueprint, artificialMuscle, printer]
    }
}




// eventmanager testing


class EventManager {
    constructor() {
        this.eventsList = []        // create array of events
    }

    subscribe(event, fn, thisValue) {
        if (typeof thisValue === 'undefined') {   // if no thisValue provided, binds the fn to the fn??
            thisValue = fn
        }
        this.eventsList.push({      // create objects linking events + functions to perform
            event: event,           // push em to the array
            fn: fn.bind(thisValue)
        })
    }

    publish(event) {
        for (let i = 0; i < this.eventsList.length; i++) {
            if (this.eventsList[i].event === event) {       // iterate through the array
                console.log('event', event)                 // call the function when it's reached
                this.eventsList[i].fn.call()
                this.eventsList.splice(i, 1)                // possibly splice fn from the list once called?
                break                                       // break so that multiples of fn are only called once
            }
        }
    }

    getEventsList() {
        return this.eventsList
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
        this.map.setCharacter(this.character)  // gives map reference to character


        // eventmanager testing

        this.EM = new EventManager()
        this.character.setEM(this.EM)


        // try generating from a set of stock items
        // bug: only the last item generated will display!!
        // testing with one item generated ...
        this.itemGenerator = new ItemGenerator(this.map, this.EM, 1)


        this.input = this.initUserInput()
    }

    initUserInput() {
        return new UserInput({
            '38': this.character.getAction('move', 'north'),
            '37': this.character.getAction('move', 'west'),
            '39': this.character.getAction('move', 'east'),
            '40': this.character.getAction('move', 'south'),
            '84': this.character.getAction('takeItem', 'item') // press 't' to takeItem
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
