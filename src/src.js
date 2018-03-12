import foo from './test'


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
        probability: 28
    }, {
        element: ',',
        description: '',
        probability: 28
    }, {
        element: ';',
        description: '',
        probability: 22
    }, {
        element: '^',
        description: '',
        probability: 22
    }, {
        element: '*',
        description: '',
        probability: 22
    }, {
        element: ';',
        description: '',
        probability: 22
    }, {
        element: '^',
        description: '',
        probability: 22
    }, {
        element: '*',
        description: '',
        probability: 22
    }
]

// klhjkhjklh
class Utility {
    static contains(obj, property) {
        return Object.keys(obj).indexOf(String(property)) !== -1
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
        // create array of size col, row
        // populate with value '.'
        this._col = col
        this._row = row
        const bareLandscape = '&nbsp;'
        this.bareLandscape = bareLandscape
        const grid = []

        for (let i = 0; i < row; i++) {
            grid[i] = []
            for (let j = 0; j < col; j++) {
                grid[i].push(bareLandscape)
            }
        }
        return grid
    }

    seed(grid) {
        const numberOfElementSeeds = this.getNumberOfElementSeeds()
        const randomElements = []
        for (let i = 0; i < numberOfElementSeeds; i++) {
            const randomElementIndex = this.randomize(LANDSCAPE.length);
            const randomElement = LANDSCAPE[randomElementIndex];
            randomElements.push(randomElement)
        }

        const seeds = this.generateSeedLocations(randomElements)
        seeds.map(seed => grid[seed.x][seed.y] = seed.element)
        // console.log('seeds: ', seeds)
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

    generateSeedLocations(randomElements) {  // create array of objects
        const seeds = randomElements.map(el => {
            el.x = this.randomize(this._row - 1)
            el.y = this.randomize(this._col - 1)
            return el
        })
        return seeds
    }

    grow() {
        let seeds = this._seeds
        let mapPopulated = false

        while (mapPopulated === false) {   // introduce while loop to populate entire map

            const nextGenSeeds = this.getNextGenSeeds(seeds)    // get next generation of seeds

            if (nextGenSeeds.length === 0) {
                mapPopulated = true
            }

            let goodSeeds = []  // goodSeeds clears itself automatically
            this.goodSeeds = goodSeeds

            nextGenSeeds.forEach((seed) => {
                const checkedSeed = this.checkSeed(seed)    // check that seed is on map
                if (checkedSeed !== null) {
                    goodSeeds.push(checkedSeed) // problem: goodSeed is too large
                }
            })

            // console.log('goodSeeds: ', goodSeeds)

            for (let goodSeed of goodSeeds) {
                const x = goodSeed.x
                const y = goodSeed.y
                if (this.seededGrid[x][y] === this.bareLandscape) {
                    this.seededGrid[x][y] = goodSeed.element    // inject seed into grid
                }
            }

            let unseededLocations = this.countUnseeded()    // find number of unseeded locations
            console.log('unseededLocations: ', unseededLocations)
            if (unseededLocations === 0) {
                mapPopulated = true     // loop until all locations are seeded
            } else {
                seeds = goodSeeds  // feed all goodSeeds back into the grower
            }
        }
    }


    countUnseeded() {
        const flattenedGrid = [].concat.apply([], this.seededGrid)
        let count = 0
        for (let i of flattenedGrid) {
            if (i === this.bareLandscape) {
                count++
            }
        }
        return count
    }


    checkSeed(seed) {
        const x = seed.x
        const y = seed.y
        let seedSucceeds = false

        // check that seed is within grid bounds
        if ((y < this._col && y >= 0) &&
            (x < this._row && x >= 0)) {
            seedSucceeds = true
        } else {
            return null
        }

        // check that seed location is not already seeded
        if (this.seededGrid[x][y] !== this.bareLandscape) {
            seedSucceeds = false
        }

        // check that seed location is not already waiting to be seeded
        this.goodSeeds.forEach(goodSeed => {
            if ((x === goodSeed.x) &&
                (y === goodSeed.y)) {
                seedSucceeds = false
            }
        })

        if (seedSucceeds === true) {
            return seed
        } else {
            return null
        }

    }


    getNextGenSeeds(seeds) {
        const nextGenSeeds = []
        seeds.forEach((originalSeed) => {

            for (let direction in DIRECTIONS) {  // for each direction
                const directionValues = DIRECTIONS[direction]
                const nextGenSeed = Object.assign({}, originalSeed)


                const percentage = nextGenSeed.probability
                const probabilityCheck = (this.probability(percentage))

                if (probabilityCheck === true) {

                    for (let key in directionValues) {  // for each key in each direction
                        if (key === 'x') {
                        nextGenSeed.x = originalSeed.x + directionValues[key]  // move from seeded location to new location
                        } else if (key === 'y') {
                        nextGenSeed.y = originalSeed.y + directionValues[key]  // currently only works for seed element 0
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
        // console.log('probabilityArray: ', probabilityArray)

        const index = this.randomize(100)
        // console.log(probabilityArray[index])

        return probabilityArray[index]
    }



}


class Map {
    constructor(col, row) {
        this.generatedMap = new MapGenerator(col, row)

        console.log('map instantiated')
        this.setInitialCharacterCoordinates()

        this.render()
    }

    setInitialCharacterCoordinates() {
        const initialCoordinates = [9, 9]
        const x = initialCoordinates[0]
        const y = initialCoordinates[1]

        const characterLocation = this.generatedMap.seededGrid[y][x]

        console.log(`character coordinates: ${initialCoordinates}`)
        console.log(`character location: ${characterLocation}`)

        this.coordinates = initialCoordinates
    }

    updateCharacterCoordinates(move) {
        const newCoordinates = [this.coordinates[0] + move.x, this.coordinates[1] + move.y]
        console.log(`character coordinates: ${newCoordinates}`)

        const x = newCoordinates[0]
        const y = newCoordinates[1]

        const characterLocation = this.generatedMap.seededGrid[y][x]

        console.log(`character location: ${characterLocation}`)

        this.coordinates = newCoordinates
    }

    moveDudeNorth() {
        console.log('north')
        this.updateCharacterCoordinates(DIRECTIONS.north)
        this.render()
    }

    moveDudeSouth() {
        console.log('south')
        this.updateCharacterCoordinates(DIRECTIONS.south)
        this.render()

    }
    moveDudeWest() {
        console.log('west')
        this.updateCharacterCoordinates(DIRECTIONS.west)
        this.render()
    }

    moveDudeEast() {
        console.log('east')
        this.updateCharacterCoordinates(DIRECTIONS.east)
        this.render()
    }

    getCharacter() {
        const character = '@'
        return character
    }

    renderItem(item) {
        let cls = ''
        if (item === '@') {
            cls = 'character'
        }
        return `<span class="item ${cls}">${item}</span>`
    }

    render() {
        // convert 2D array map into browser-displayable strings
        const displayGrid = this.generatedMap.seededGrid.map(arr => { return arr.slice() })

        const x = this.coordinates[0]
        const y = this.coordinates[1]

        displayGrid[y][x] = this.getCharacter()

        const renderedGrid = [];

        for (let i = 0; i < displayGrid.length; i++) {
            const rowItems = displayGrid[i]
            const row = rowItems.reduce((sum, item) => sum + this.renderItem(item), '')

            renderedGrid.push(row);
        }

        const gridToHTML = renderedGrid.join('<br />');

        // display the rendered app
        const el = document.getElementById('map');
        el.innerHTML = gridToHTML;
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
        this.spaces = [];
        this.gameOver = false;
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

window.game = new Game();




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
