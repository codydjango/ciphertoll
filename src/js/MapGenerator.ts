import { DIRECTIONS } from './Constants'
import { bare, features } from './LandscapeData'
import Utility from './Utility'




class MapGenerator {

    public col: any
    public row: any
    public grid: any
    public seeds: any
    public goodSeeds: any
    public newSeed: any
    public originalSeed: any
    public direction: any
    public nextGenSeeds: any

    public generate(obj: any) { // originally this came from destructured { col, row }

        this.col = obj.col
        this.row = obj.row

        this.makeGrid()
        this.seed()
        this.grow()

        console.log('map generated')

        return this.grid
    }

    public makeGrid() {
        this.grid = []
        for (let i = 0; i < this.row; i++) {
            this.grid[i] = []
            for (let j = 0; j < this.col; j++) {
                let newCell = Object.assign({}, bare)
                newCell = this.assignCoordinates(newCell, j, i)
                this.grid[i].push(newCell)
            }
        }
    }

    public assignCoordinates(cell: any, xCoord: any, yCoord: any) {
        cell.x = xCoord
        cell.y = yCoord
        return cell
   }

   public seed() {
        const randomElements = []
        for (let i = 0; i < this.getNumberOfElementSeeds(); i++) {
            randomElements.push(features[Utility.randomize(features.length)])
        }
        this.seeds = this.generateSeedLocations(randomElements)
        this.seeds.map((seed: any) => this.grid[seed.y][seed.x] = seed)

    }

    public getNumberOfElementSeeds() {
        return (this.col + this.row)  // rich initial seeding
    }

    public generateSeedLocations(randomElements: any) {
        return randomElements.map((el: any) => {
            el.x = Utility.randomize(this.row - 1)
            el.y = Utility.randomize(this.col - 1)
            return el
        })
    }

    public grow() {
        let mapPopulated = false

        while (!mapPopulated) {
            this.generateNextSeedBatch()
            if (this.outOfSeeds()) {
                mapPopulated = true
            }
            this.filterBadSeeds()
            this.plantSeeds()
            this.hasUnseededLocations() ? this.seeds = this.goodSeeds : mapPopulated = true
        }
    }

    public generateNextSeedBatch() {
        this.nextGenSeeds = []
        this.seeds.forEach((originalSeed: any) => {
            this.originalSeed = originalSeed
            this.getNewSeed()
        })
    }


    public getNewSeed() {
       for (const key in DIRECTIONS) {
           if (key) {
            this.newSeed = Object.assign({}, this.originalSeed)
            this.direction = DIRECTIONS[key]
            if (this.checkProbability(this.newSeed)) {
                this.createNewSeedCoordinates()
                this.nextGenSeeds.push(this.newSeed)
            }
           }
        }
    }

    public checkProbability(newSeed: any) {
        return Utility.probability(newSeed.probability)
    }

    public createNewSeedCoordinates() {
        for (const key in this.direction) {
            if (key === 'x') {
            this.newSeed.x = this.originalSeed.x + this.direction[key]
            } else if (key === 'y') {
            this.newSeed.y = this.originalSeed.y + this.direction[key]
            }
        }
    }


    public outOfSeeds() {
        return !this.nextGenSeeds.length
    }

    public filterBadSeeds() {
        this.goodSeeds = []
        this.nextGenSeeds.forEach((seed: any) => {
            if (this.checkSeed(seed)) {
                this.goodSeeds.push(this.checkSeed(seed))
            }
        })
    }

    public checkSeed(seed: any) {
        if (this.ifOffMap(seed)) {return null}
        if (this.isAlreadySeeded(seed)) {return null}
        // if (this.isWaitingToBeSeeded(seed)) return null
        return seed
    }

    public ifOffMap(seed: any) {
        return !((seed.x < this.col && seed.x >= 0) && (seed.y < this.row && seed.y >= 0))
    }

    public isAlreadySeeded(seed: any) {
        return this.grid[seed.y][seed.x].cls !== 'blank'
    }


    public plantSeeds() {
        this.goodSeeds.forEach((goodSeed: any) => {
            if (this.grid[goodSeed.y][goodSeed.x].cls === 'blank') {
                this.grid[goodSeed.y][goodSeed.x] = goodSeed
            }
        })
    }

    public hasUnseededLocations() {
        const flattenedGrid = [].concat.apply([], this.grid)
        let count = 0
        for (const i of flattenedGrid) {
            if (i.cls === 'blank') { count++ }
        }
        return count
    }

}

export default MapGenerator
