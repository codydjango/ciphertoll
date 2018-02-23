class Utility {
    static contains(obj, property) {
        return Object.keys(obj).indexOf(String(property)) !== -1
    }
}


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

class Map {

    constructor(col, row) {
        console.log('creating map')

        const grid = this.init(col, row)
        const seededGrid = this.seed(grid)
        
        this.grow(seededGrid)

        this.seededGrid = seededGrid
        this.setInitialCharacterCoordinates()
        this.render()



    }

    init(col, row) {
        // create array of size col, row
        // populate with value '.'
        this._col = col
        this._row = row
        const grid = []
        for (let i = 0; i < row; i++) {
            grid[i] = []
            for (let j = 0; j < col; j++) {
                grid[i].push('.')
            }
        }
        return grid
    }


    seed(grid) {
        // seed map with initial elements

        const landscapeElements = ['t', 'M', '*']
        const numberOfElementSeeds = this.getNumberOfElementSeeds()

        const randomElements = []
        for (let i = 0; i < numberOfElementSeeds; i++) {
            // get random element from available elements
            const randomElementIndex = this.randomize(landscapeElements.length);
            const randomElement = landscapeElements[randomElementIndex];
            
            randomElements.push(randomElement)
        }

        const seedLocations = this.generateSeedLocations(randomElements)

        seedLocations.map((seedLocation, index) => 
            grid[seedLocation.x][seedLocation.y] = randomElements[index])

        this._seedLocations = seedLocations
        this._randomElements = randomElements

        return grid
    }

    getNumberOfElementSeeds() {
        //  return 1 // test setting
        return ((this._col * this._row) / (this._col + this._row))  // sparse initial seeding
    }

    randomize(mult) {
        return Math.floor(Math.random() * mult)
    }

    probability(percentage) {
        this.randomize(100) + 1 // random number out of 100

        // const probability = Math.floor(Math.random() * 3);  // likelihood of growing from seed
        //         if (probability === 0) { // 50% chance
        //             console.log('probability check ' + j);
        //             array2d[x + xIncrement][y + yIncrement] = growSource;  // assign neighboring location seed
        //             xSeeded.push(x + xIncrement); // adding the new seed location
        //             ySeeded.push(y + yIncrement);
        //         }
        //     }
        // }

    }


    generateSeedLocations(randomElements) {  // create array of objects
        const seedLocations = randomElements.map(element => {
            return { 
                x: this.randomize(this._row - 1),   
                y: this.randomize(this._col - 1)
            }
        })
        return seedLocations
    }


    checkSeed(seed) {
        if (seed[0] >= this._col || seed[0] < 0 ||
            seed[1] >= this._row || seed[1] < 0) {
            console.log('rejected seed ' + seed)
            return [this._seedLocations[0].x, this._seedLocations[0].y] // original seed 
            // can't return null, undefined, [] ...
        } else {
            return seed
        }
    }


    directions() {
        return DIRECTIONS
    }


    getNextGenSeeds() {
        const nextGenSeeds = this._seedLocations.map((location) => {   
            const directions = this.directions()
            const seeds = []
            for (let direction in directions) {  // for each direction
                let directionValues = directions[direction]
                const nextGenSeed = []
                for (let key in directionValues) {  // for each key in each direction
                    if (key === 'x') {
                        const x = location.x + directionValues[key]  // move from seeded location to new location
                        nextGenSeed.push(x)
                    } else if (key === 'y') {
                        const y = location.y + directionValues[key]  // currently only works for seed element 0
                        nextGenSeed.push(y)
                    }
                }
                seeds.push(nextGenSeed)
            }
            return seeds // return from .map
        })

        return nextGenSeeds
    }


    grow(seededGrid) {

        // loop until entire map is filled:
        // let mapPopulated = false;   
        // while (!mapPopulated) {}

        const allSeeds = this.getNextGenSeeds()
        console.log('seeds: ', allSeeds)

        const goodSeeds = []  // oldschool way to do it
        for (let seeds of allSeeds) {
            for (let seed of seeds) {
                const goodSeed = this.checkSeed(seed)
                goodSeeds.push(goodSeed)
            }
        }

        // const goodSeeds = seeds.filter((seed) => {  // better, but does not filter!
        //     return this.checkSeed(seed)
        // })
        console.log('good seeds: ', goodSeeds)

        // now build the map
        for (let goodSeed of goodSeeds) {
            const x = goodSeed[0]
            const y = goodSeed[1]
            seededGrid[x][y] = this._randomElements[0] // currently only works for seed index 0
            // try keying to index of allSeeds
        } 
    }

    render() {
        // convert 2D array map into browser-displayable strings
        const displayGrid = this.seededGrid.map(arr => { return arr.slice() })

        const character = '@'

        const x = this.coordinates[0]
        const y = this.coordinates[1]
        displayGrid[y][x] = character

        const renderedGrid = [];
        for (let i = 0; i < displayGrid.length; i++) {
            renderedGrid.push(displayGrid[i].join(''));
        }


        const gridToHTML = renderedGrid.join('<br />');


        // display the rendered ap
        const el = document.getElementById('map');

        el.innerHTML = gridToHTML;
    }

    setInitialCharacterCoordinates() {

        const initialCoordinates = [9, 9]
        const x = initialCoordinates[0]
        const y = initialCoordinates[1]
        const characterLocation = this.seededGrid[y][x]

        console.log(`character coordinates: ${initialCoordinates}`)
        console.log(`character location: ${characterLocation}`)
        
        this.coordinates = initialCoordinates
    }

    updateCharacterCoordinates(move) {
        const newCoordinates = [this.coordinates[0] + move.x, this.coordinates[1] + move.y]
        console.log(`character coordinates: ${newCoordinates}`)
 
        const x = newCoordinates[0]
        const y = newCoordinates[1]
        const characterLocation = this.seededGrid[y][x]
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

}


class Game {
    constructor() {
        this.initGame()
        this.startGame()
    }

    initGame() {
        this.spaces = [];
        this.gameOver = false;
        this.map = new Map(30, 10)
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