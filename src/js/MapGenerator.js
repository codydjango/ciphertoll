import Utility from './Utility'
import LandscapeData from './LandscapeData'
import { DIRECTIONS } from './Constants'


class MapGenerator {
    constructor(col, row) {
        console.log('generating map')
        this.landscapeSeeds = new LandscapeData()
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
                seeds = goodSeeds
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
                if (Utility.probability(nextGenSeed.probability)) {
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

    // probability(percentage) {
    //     const probabilityArray = []
    //     for (let i = 0; i < percentage; i++) {
    //         probabilityArray.push(true)
    //     }
    //     for (let i = 0; i < 100 - percentage; i++) {
    //         probabilityArray.push(false)
    //     }
    //     return probabilityArray[Utility.randomize(100)]
    // }
}

export default MapGenerator
