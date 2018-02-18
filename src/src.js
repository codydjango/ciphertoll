class Utility {

}


class Map {

    constructor(col, row) {
        console.log('creating map')

        const grid = this.init(col, row)
        const seededGrid = this.seed(grid)
        
        this.grow(seededGrid)

        this.render(seededGrid)

        
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
        const directions = {
            north: { x: 0, y: -1 },
            south: { x: 0, y: 1 },
            east: { x: 1, y: 0 },
            west: { x: -1, y: 0 },
            northwest: { x: -1, y: -1 },
            northeast: { x: 1, y: -1 },
            southeast: { x: 1, y: 1 },
            southwest: { x: -1, y: 1 }
        }
        return directions
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


    grow(seededGrid)   {

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


    render(grid) {
        // convert 2D array map into browser-displayable strings

        const condensedMap = [];
        for (let i = 0; i < grid.length; i++) {
            condensedMap.push(grid[i].join(''));
        }

        const renderedMap = condensedMap.join('<br />');
        const el = document.getElementById('map');

        el.innerHTML = renderedMap;
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
        this.map = new Map(10, 10)
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