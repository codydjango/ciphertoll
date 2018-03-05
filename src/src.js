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

    static renderItem(item) {
        let cls = ''
        let element = '&nbsp;'
        if (item) {
            cls = item.cls
            element = item.element
        }
        let style = ''
        if (item.top && item.left) {
            style = `top: ${item.top}px; left: ${item.left}px`
        }
        return `<span class="item ${cls}" style="${style}">${element}</span>`
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
            description: '',
            probability: 28,
            cls: 'period'
        }
        const comma = {
            element: ',',
            description: '',
            probability: 28,
            cls: 'comma'
        }
        const semicolon = {
            element: ';',
            description: '',
            probability: 22,
            cls: 'semicolon'
        }
        const grave = {
            element: '^',
            description: '',
            probability: 22,
            cls: 'grave'
        }
        const asterisk = {
            element: '*',
            description: '',
            probability: 22,
            cls: 'asterisk'
        }
        return [period, comma, semicolon, asterisk, grave]
    }

    bare() {
        const bare = {
            element: '&nbsp;',
            description: '',
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
        this._col = col
        this._row = row
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
            randomElements.push(this.landscapeSeeds.features[this.randomize(this.landscapeSeeds.features.length)])
        }
        const seeds = this.generateSeedLocations(randomElements)
        seeds.map(seed => grid[seed.x][seed.y] = seed)
        this._seeds = seeds
        return grid
    }

    getNumberOfElementSeeds() {
        //  return 1        // test setting
        // return ((this._col * this._row) / (this._col + this._row))  // sparse initial seeding
        return (this._col + this._row)  // rich initial seeding
    }

    randomize(mult) {
        return Math.floor(Math.random() * mult)
    }

    generateSeedLocations(randomElements) {
        return randomElements.map(el => {
            el.x = this.randomize(this._row - 1)
            el.y = this.randomize(this._col - 1)
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
        if ((seed.x < this._col && seed.x >= 0) &&
            (seed.x < this._row && seed.x >= 0)) {
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
        // console.log('nextGenSeeds: ', nextGenSeeds)
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
        return probabilityArray[this.randomize(100)]
    }
}


class Map {   // aka board, 'play area'
    constructor(col, row) {
        this.col = col
        this.row = row

        this.generatedMap = new MapGenerator(col, row)
        this.map = this.generatedMap.getMap()
        this.mapCenter = this.getMapCenter()

        this.scenery = new Scenery(this.map)

    }

    getMap() {
        return this.map
    }

    getMapCenter() {
        return [Math.floor(this.col/2), Math.floor(this.row/2)]
    }

    setCharacter(character) {
        this.character = character
    }



    // updateGridIndices(sprite, move) {          // possibly make a generalized method?
    // }                                            // which then takes 'character' / 'sprite' as input?
    // updateLayer(sprite) {
    // }
    // drawLayer(sprite) {
    // }

}


class Scenery {
    constructor(map) {
        this.map = map
        this.render()
        console.log('scenery rendered')
    }

    setLayer(layer) {
        this.layer = layer
    }

    getLayer() {
        return this.layer
    }

    createLayer(grid) {
        const sceneryGrid = []
        for (let i = 0; i < grid.length; i++) {
            const rowItems = grid[i]
            let row = ''
            for (let i = 0; i < rowItems.length; i++) {
                row += Utility.renderItem(rowItems[i]) // add rendered items to the grid
            }
            sceneryGrid.push(row)
        }
        return sceneryGrid
    }

    render() {
        const grid = this.map.map(arr => { return arr.slice() })
        this.setLayer(this.createLayer(grid))
        this.drawLayer()
    }

    drawLayer() {
        const renderedLayer = this.getLayer()
        const gridToHTML = renderedLayer.join('<br />')  // using HTML breaks for now
        const el = document.getElementById('landscape-layer')
        el.innerHTML = gridToHTML
    }
}


class Character {
    constructor(map, mapCenter) {
        this.map = map
        this.mapCenter = mapCenter
        this.setInitialGridIndices()
        this.render()
        console.log('character rendered')

    }

    setLayer(layer) {
        this.characterLayer = layer
    }

    getLayer() {
        return this.characterLayer
    }

    createLayer() {
        return Utility.renderItem(this.getCharacter())
    }

    setInitialGridIndices() {
        const initGridIndices = this.mapCenter
        const location = this.map[initGridIndices[1]][initGridIndices[0]]
        this.gridIndices = initGridIndices
        console.log(`location description: ${location.description}`)
    }

    updateGridIndices(move) {
        const newGridIndices = [this.gridIndices[0] + move.x, this.gridIndices[1] + move.y]
        let location = ''
        if (this.checkGridIndices(newGridIndices)) {
            location = this.map[newGridIndices[1]][newGridIndices[0]]
            this.gridIndices = newGridIndices
            console.log(`location description: ${location.description}`)
        } else {
            location = this.map[this.gridIndices[1], this.gridIndices[0]]
            console.log("you've reached the map's edge")
        }
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

    getCharacter() {
        const { x, y } = this.getCoordinates()
        const character = {
            element: '@',
            cls: 'character',
            top: y,
            left: x
        }
        return character
    }



    getCoordinates() {
        const css = this.getCSSHeightAndWidth()
        const x = this.gridIndices[0] * css.height
        const y = this.gridIndices[1] * css.width
        return { x, y }
    }

    getCSSHeightAndWidth() {
        const el = document.querySelector('.item')
        const style = window.getComputedStyle(el)
        const width = Utility.stringToNumber(style.getPropertyValue('width'))
        const height = Utility.stringToNumber(style.getPropertyValue('height'))
        return { width, height }
    }

    updateLayer() {
        this.setLayer(this.createLayer())
    }

    drawLayer() {
        const el = document.getElementById('character-layer')
        el.innerHTML = this.getLayer();
    }

    render() {
        this.setLayer(this.createLayer())
        this.drawLayer()
    }

    getAction(fnName, arg) {
        return this[fnName].bind(this, arg)
    }

    move(direction) {
        console.log(`${direction}`)
        this.updateGridIndices(DIRECTIONS[direction])
        this.updateLayer()
        this.drawLayer()
    }






    // moveDudeNorth() {   // refactor movement into its own space?
    //     console.log('north')
    //     this.character.updateGridIndices(DIRECTIONS.north)
    //     this.character.updateLayer()
    //     this.character.drawLayer()
    // }

    // moveDudeSouth() {
    //     console.log('south')
    //     this.character.updateGridIndices(DIRECTIONS.south)
    //     this.character.updateLayer()
    //     this.character.drawLayer()

    // }

    // moveDudeWest() {
    //     console.log('west')
    //     this.character.updateGridIndices(DIRECTIONS.west)
    //     this.character.updateLayer()
    //     this.character.drawLayer()
    // }

    // moveDudeEast() {
    //     console.log('east')
    //     this.character.updateGridIndices(DIRECTIONS.east)
    //     this.character.updateLayer()
    //     this.character.drawLayer()
    // }

    // getCharacterGridIndices() {
    //     const x = this.gridIndices[0]
    //     const y = this.gridIndices[1]
    //     return { x, y }
    // }

    // moveCharacter(move) {
    //     const el = document.getElementById('character')

    //     console.log('moveCharacter: ', move)

    //     el.style.top += move.x
    //     el.style.left += move.y
    // }
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
        this.character = new Character(this.map.getMap(), this.map.getMapCenter())
        this.map.setCharacter(this.character)
        this.input = this.initUserInput()
    }

    initUserInput() {
        return new UserInput({
            '38': this.character.getAction('move', 'north'),
            '37': this.character.getAction('move', 'west'),
            '39': this.character.getAction('move', 'east'),
            '40': this.character.getAction('move', 'south'),
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
