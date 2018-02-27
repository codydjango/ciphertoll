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

const LANDSCAPE = [
    {
        element: '.',
        description: '',
        probability: 28,
        cls: 'period'
    }, {
        element: ',',
        description: '',
        probability: 28,
        cls: 'comma'
    }, {
        element: ';',
        description: '',
        probability: 22,
        cls: 'semicolon'
    }, {
        element: '^',
        description: '',
        probability: 22,
        cls: 'grave'
    }, {
        element: '*',
        description: '',
        probability: 22,
        cls: 'asterisk'
    }
]

const BARELANDSCAPE = {
    element: '&nbsp;',
    cls: 'blank'
}


class Utility {
    static contains(obj, property) {
        return Object.keys(obj).indexOf(String(property)) !== -1
    }

    static stringToNumber(string) {
        return string.match(/\d+/)[0]
    }

}


class MapGenerator {
    constructor(col, row) {
        console.log('generating map')
        const grid = this.init(col, row)
        const seededGrid = this.seed(grid)
        this.seededGrid = seededGrid
        this.grow()
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
                grid[i].push(BARELANDSCAPE)
            }
        }
        return grid
    }

    seed(grid) {
        const randomElements = []
        for (let i = 0; i < this.getNumberOfElementSeeds(); i++) {
            randomElements.push(LANDSCAPE[this.randomize(LANDSCAPE.length)])
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
                if (this.seededGrid[goodSeed.x][goodSeed.y] === BARELANDSCAPE) {
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
            if (i === BARELANDSCAPE) {
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
        if (this.seededGrid[seed.x][seed.x] !== BARELANDSCAPE) {  
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
        console.log('nextGenSeeds: ', nextGenSeeds)
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






class Map {
    constructor(col, row) {
        this.col = col
        this.row = row
        this.generatedMap = new MapGenerator(col, row)
        this.map = this.generatedMap.getMap()

        console.log('map instantiated')
        this.setInitialCharacterGridIndices()

        this.render()
    }


    getMapCenter() {
        return [Math.floor(this.col/2), Math.floor(this.row/2)]
    }

    setInitialCharacterGridIndices() {
        const initGridIndices = this.getMapCenter()
        const characterLocation = this.map[initGridIndices[1]][initGridIndices[0]]
        this.gridIndices = initGridIndices

        console.log(`grid indices: ${initGridIndices}`)
        console.log(`landscape: ${characterLocation.element}`)
    }

    updateCharacterGridIndices(move) {
        const newGridIndices = [this.gridIndices[0] + move.x, this.gridIndices[1] + move.y]
        const characterLocation = this.map[newGridIndices[1]][newGridIndices[0]]
        this.gridIndices = newGridIndices

        console.log(`grid indices: ${newGridIndices}`)
        console.log(`landscape: ${characterLocation.element}`)
    }

    moveDudeNorth() {
        console.log('north')
        this.updateCharacterGridIndices(DIRECTIONS.north)
        this.updateCharacterLayer()
        this.drawCharacterLayer()
    }

    moveDudeSouth() {
        console.log('south')
        this.updateCharacterGridIndices(DIRECTIONS.south)
        this.updateCharacterLayer()
        this.drawCharacterLayer()

    }

    moveDudeWest() {
        console.log('west')
        this.updateCharacterGridIndices(DIRECTIONS.west)
        this.updateCharacterLayer()
        this.drawCharacterLayer()
    }

    moveDudeEast() {
        console.log('east')
        this.updateCharacterGridIndices(DIRECTIONS.east)
        this.updateCharacterLayer()
        this.drawCharacterLayer()
    }

    getCharacter() {
        const { x, y } = this.getCharacterCoordinates()
        const character = {
            element: '@',
            cls: 'character',
            top: y,
            left: x
        }
        return character
    }

    renderItem(item) {
        let cls = ''
        let element = '&nbsp;'

        if (item) {
            cls = item.cls
            element = item.element
        }

        let style = ''
        if (item.top && item.left) {    // if item has top / left style qualities
            style = `top: ${item.top}px; left: ${item.left}px`
        }

        return `<span class="item ${cls}" style="${style}">${element}</span>`
    }

    getCharacterGridIndices() {
        const x = this.gridIndices[0]
        const y = this.gridIndices[1]
        return { x, y }
    }

    getCharacterCoordinates() {
        const css = this.getCSSHeightAndWidth()
        const x = this.gridIndices[0] * css.height
        const y = this.gridIndices[1] * css.width
        return { x, y }
    }


    getCSSHeightAndWidth() {
        const el = document.querySelector('.item')
        console.log('el: ', el)
        const style = window.getComputedStyle(el)
        const width = Utility.stringToNumber(style.getPropertyValue('width'))
        const height = Utility.stringToNumber(style.getPropertyValue('height'))
        return { width, height }
    }












    createLandscapeLayer(grid) {
        const landscapeGrid = []
        for (let i = 0; i < grid.length; i++) {
            const rowItems = grid[i]
            let row = ''
            for (let i = 0; i < rowItems.length; i++) {
                row += this.renderItem(rowItems[i]) // add rendered items to the grid
            }
            landscapeGrid.push(row)
        }
        return landscapeGrid
    }

    setLandscapeLayer(layer) {
        this.landscapeLayer = layer
    }

    getLandscapeLayer() {
        return this.landscapeLayer
    }

    drawLandscapeLayer() {
        const renderedGrid = this.getLandscapeLayer()
        const gridToHTML = renderedGrid.join('<br />')  // using HTML breaks for now
        const el = document.getElementById('landscape-layer')
        el.innerHTML = gridToHTML;
    }



    createCharacterLayer() {
        return this.renderItem(this.getCharacter())
    }
    setCharacterLayer(layer) {
        this.characterLayer = layer
    }
    getCharacterLayer() {
        return this.characterLayer
    }
    drawCharacterLayer() {
        const el = document.getElementById('character-layer')
        el.innerHTML = this.getCharacterLayer();
    }



    moveCharacter(move) {
        const el = document.getElementById('character')

        el.style.top += move.x
        el.style.left += move.y
    }

    updateCharacterLayer() {
        this.setCharacterLayer(this.createCharacterLayer())
    }










    render() {

        const grid = this.map.map(arr => { return arr.slice() })
        


        this.setLandscapeLayer(this.createLandscapeLayer(grid))
        this.drawLandscapeLayer()


        this.setCharacterLayer(this.createCharacterLayer())
        this.drawCharacterLayer()
    }

    draw() {
        this.render()
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
        this.input = this.initUserInput()
    }

    initUserInput() {
        return new UserInput({
            '38': this.map.moveDudeNorth.bind(this.map),
            '37': this.map.moveDudeWest.bind(this.map),
            '39': this.map.moveDudeEast.bind(this.map),
            '40': this.map.moveDudeSouth.bind(this.map),
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
