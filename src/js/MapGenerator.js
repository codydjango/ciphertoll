import Utility from './Utility'
import LandscapeData from './LandscapeData'
import { DIRECTIONS } from './Constants'


class MapGenerator {
    constructor() {}

    generate({ col, row }) {

        this.col = col
        this.row = row

        this.landscapeSeeds = new LandscapeData()

        this.makeGrid()
        this.seed()
        this.grow()

        console.log('map generated')

        return this.grid
    }

    makeGrid() {
        this.grid = []
        for (let i = 0; i < this.row; i++) {
            this.grid[i] = []
            for (let j = 0; j < this.col; j++) {
                let newCell = Object.assign({}, this.landscapeSeeds.bare)
                newCell = this.assignCoordinates(newCell, j, i)
                this.grid[i].push(newCell)
            }
        }
    }

    assignCoordinates(cell, xCoord, yCoord) {
        cell.x = xCoord
        cell.y = yCoord
        return cell
   }

    seed() {
        const randomElements = []
        for (let i = 0; i < this.getNumberOfElementSeeds(); i++) {
            randomElements.push(this.landscapeSeeds.features[Utility.randomize(this.landscapeSeeds.features.length)])
        }
        this.seeds = this.generateSeedLocations(randomElements)
        this.seeds.map(seed => this.grid[seed.y][seed.x] = seed)

    }

    getNumberOfElementSeeds() {
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
        let mapPopulated = false

        while (!mapPopulated) {
            this.generateNextSeedBatch()
            if (this.outOfSeeds()) mapPopulated = true
            this.filterBadSeeds()
            this.plantSeeds()
            this.hasUnseededLocations() ? this.seeds = this.goodSeeds : mapPopulated = true
        }
    }

    generateNextSeedBatch() {
        this.nextGenSeeds = []
        this.seeds.forEach((originalSeed) => {
            this.originalSeed = originalSeed
            this.getNewSeed()
        })
    }


    getNewSeed() {
       for (let key in DIRECTIONS) {
            this.newSeed = Object.assign({}, this.originalSeed)
            this.direction = DIRECTIONS[key]
            if (this.checkProbability(this.newSeed)) {
                this.createNewSeedCoordinates()
                this.nextGenSeeds.push(this.newSeed)
            }
        }
    }

    checkProbability(newSeed) {
        return Utility.probability(newSeed.probability)
    }

    createNewSeedCoordinates() {
        for (let key in this.direction) {
            if (key === 'x') {
            this.newSeed.x = this.originalSeed.x + this.direction[key]
            } else if (key === 'y') {
            this.newSeed.y = this.originalSeed.y + this.direction[key]
            }
        }
    }


    outOfSeeds() {
        return !this.nextGenSeeds.length
    }

    filterBadSeeds() {
        this.goodSeeds = []
        this.nextGenSeeds.forEach((seed) => {
            if (this.checkSeed(seed)) {
                this.goodSeeds.push(this.checkSeed(seed))
            }
        })
    }

    checkSeed(seed) {
        if (this.ifOffMap(seed)) return null
        if (this.isAlreadySeeded(seed)) return null
        // if (this.isWaitingToBeSeeded(seed)) return null
        return seed
    }

    ifOffMap(seed) {
        return !((seed.x < this.col && seed.x >= 0) && (seed.y < this.row && seed.y >= 0))
    }

    isAlreadySeeded(seed) {
        return this.grid[seed.y][seed.x].cls !== 'blank'
    }


    plantSeeds() {
        this.goodSeeds.forEach((goodSeed) => {
            if (this.grid[goodSeed.y][goodSeed.x].cls === 'blank') {
                this.grid[goodSeed.y][goodSeed.x] = goodSeed
            }
        })
    }

    hasUnseededLocations() {
        const flattenedGrid = [].concat.apply([], this.grid)
        let count = 0
        for (let i of flattenedGrid) {
            if (i.cls === 'blank') count++
        }
        return count
    }

}

export default MapGenerator
