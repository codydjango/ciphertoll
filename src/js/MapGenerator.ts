import { DIRECTIONS } from "./Constants";
import { IMapSize } from "./game";
import { bare, features, ILandscape } from "./LandscapeData";
import Utility from "./Utility";

interface IDirection {
    x: number;
    y: number;
}

class MapGenerator {
    public col: number;
    public row: number;
    public grid: ILandscape[][];
    public seeds: ILandscape[];
    public nextGenSeeds: ILandscape[];
    public newSeed: ILandscape;
    public originalSeed: ILandscape;
    public direction: IDirection;
    public goodSeeds: ILandscape[];

    public generate({ col, row }: IMapSize) {
        this.col = col;
        this.row = row;

        this.makeGrid();
        this.seed();
        this.grow();

        console.log("map generated");

        return this.grid;
    }

    private makeGrid() {
        this.grid = [];
        for (let i = 0; i < this.row; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.col; j++) {
                let newCell = Object.assign({}, bare);
                newCell = this.assignCoordinates(newCell, j, i);
                this.grid[i].push(newCell);
            }
        }
    }

    private assignCoordinates(
        cell: ILandscape,
        xCoord: number,
        yCoord: number
    ) {
        cell.x = xCoord;
        cell.y = yCoord;
        return cell;
    }

    private seed() {
        const randomElements: ILandscape[] = [];
        for (let i = 0; i < this.getNumberOfElementSeeds(); i++) {
            randomElements.push(features[Utility.randomize(features.length)]);
        }
        this.seeds = this.generateSeedLocations(randomElements);
        this.seeds.map(seed => {
            if (seed.x && seed.y) {
                this.grid[seed.y][seed.x] = seed;
            }
        });
    }

    private getNumberOfElementSeeds() {
        return this.col + this.row; // rich initial seeding
    }

    private generateSeedLocations(randomElements: ILandscape[]) {
        return randomElements.map(el => {
            el.x = Utility.randomize(this.row - 1);
            el.y = Utility.randomize(this.col - 1);
            return el;
        });
    }

    /////////////

    private grow() {
        let mapPopulated = false;

        while (!mapPopulated) {
            this.generateNextSeedBatch();
            if (this.outOfSeeds()) {
                mapPopulated = true;
            }
            this.filterBadSeeds();
            this.plantSeeds();
            this.hasUnseededLocations()
                ? (this.seeds = this.goodSeeds)
                : (mapPopulated = true);
        }
    }

    private generateNextSeedBatch() {
        this.nextGenSeeds = [];
        this.seeds.forEach(originalSeed => {
            this.originalSeed = originalSeed;
            this.getNewSeed();
        });
    }

    private getNewSeed() {
        for (const key in DIRECTIONS) {
            if (key) {
                this.newSeed = Object.assign({}, this.originalSeed);
                this.direction = DIRECTIONS[key];
                if (this.checkProbability(this.newSeed)) {
                    this.createNewSeedCoordinates();
                    this.nextGenSeeds.push(this.newSeed);
                }
            }
        }
    }

    private checkProbability(newSeed: ILandscape) {
        return Utility.probability(newSeed.probability);
    }

    private createNewSeedCoordinates() {
        for (const key in this.direction) {
            if (key === "x" && this.originalSeed.x) {
                this.newSeed.x = this.originalSeed.x + this.direction[key];
            } else if (key === "y" && this.originalSeed.y) {
                this.newSeed.y = this.originalSeed.y + this.direction[key];
            }
        }
    }

    private outOfSeeds() {
        return !this.nextGenSeeds.length;
    }

    private filterBadSeeds() {
        this.goodSeeds = [];
        this.nextGenSeeds.forEach(seed => {
            const checkedSeed = this.checkSeed(seed);
            if (checkedSeed) {
                this.goodSeeds.push(checkedSeed);
            }
        });
    }

    private checkSeed(seed: ILandscape) {
        if (this.ifOffMap(seed)) {
            return null;
        } else if (this.isAlreadySeeded(seed)) {
            return null;
        } else {
            return seed;
        }
    }

    private ifOffMap(seed: ILandscape) {
        if (seed.x && seed.y) {
            return !(
                seed.x < this.col &&
                seed.x >= 0 &&
                (seed.y < this.row && seed.y >= 0)
            );
        } else {
            return true;
        }
    }

    private isAlreadySeeded(seed: ILandscape) {
        if (seed.x && seed.y) {
            return this.grid[seed.y][seed.x].cls !== "blank";
        } else {
            return true;
        }
    }

    private plantSeeds() {
        this.goodSeeds.forEach(goodSeed => {
            if (goodSeed.x && goodSeed.y) {
                if (this.grid[goodSeed.y][goodSeed.x].cls === "blank") {
                    this.grid[goodSeed.y][goodSeed.x] = goodSeed;
                }
            }
        });
    }

    private hasUnseededLocations() {
        const flattenedGrid: ILandscape[] = [].concat.apply([], this.grid);
        let count = 0;
        for (const i of flattenedGrid) {
            if (i.cls === "blank") {
                count++;
            }
        }
        return count;
    }
}

export default MapGenerator;
