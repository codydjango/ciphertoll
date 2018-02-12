class Map {

    constructor(col, row) {
        console.log('creating map')

        const grid = this.init(col, row)
        const gridWithSeeds = this.seed(grid);
        
        this.render(gridWithSeeds)
    }

    init(col, row) {
        this._col = col
        this._row = row

        // create array of size x, y
        // populate with value '.'

        const map = [];
        
        for (let i = 0; i < row; i++) {
            map[i] = [];
            for (let j = 0; j < col; j++) {
                map[i].push('.');
            }
        }

        return map
    }

    getNumberOfElementSeeds() {
        // const numberOfElementSeeds = 4; // rich initial seeding
        return ((this._col * this._row) / (this._col + this._row));  // sparse initial seeding
    }

    randomize(mult) {
        return Math.floor(Math.random() * mult)
    } 

    seed(grid) {
        // 2. seed map with initial elements

        const landscapeElements = ['t', 'M', '*']; // trees, mountains, plains (?)

        const numberOfElementSeeds = this.getNumberOfElementSeeds()

        const randomElements = []
        for (let i = 0; i < numberOfElementSeeds; i++) {
            // get random element from available elements
            const randomElementIndex = this.randomize(landscapeElements.length);
            const randomElement = landscapeElements[randomElementIndex];
            
            randomElements.push(randomElement)
        }

        const seedLocations = this.generateSeedLocations(randomElements)

        seedLocations.map((seedLocation, index) => grid[seedLocation.x][seedLocation.y] = randomElements[index])

        this._seedLocation = seedLocations
        this._randomElements = randomElements

        return grid
    }

    generateSeedLocations(randomElements) {
        const seedLocations = randomElements.map(i => {
            return { x: this.randomize(this._col), y: this.randomize(this._row)}
        })

        return seedLocations
    }

    growLoop(xIncrement, yIncrement) { // add probability arg (?)
        // 2. grow element territories from seeds

        // loop until entire map is filled:
        // let mapPopulated = false;   
        // while (!mapPopulated) {


        for (let j = 0; j < xSeeded.length; j++) {
            const probability = Math.floor(Math.random() * 3);  // likelihood of growing from seed
            const x = xSeeded[j];
            const y = ySeeded[j];
            const growSource = array2d[x][y]; // find a seeded location

            if (array2d[x + xIncrement] === undefined) {  // returns undefined if seeding beyond X axis
                continue;     
            } else if (array2d[x + xIncrement][y + yIncrement] !== NaN) {  
                // hmmm.. what to do if that location is larger than the Y axis size?
                // currently this code will not seed beyond left border of Y axis,
                // but will append characters to the end...
                if (probability === 0) { // 50% chance
                    console.log('probability check ' + j);
                    array2d[x + xIncrement][y + yIncrement] = growSource;  // assign neighboring location seed
                    xSeeded.push(x + xIncrement); // adding the new seed location
                    ySeeded.push(y + yIncrement);
                }
            }
        }
    }

    render(grid) {
        // convert 2D array map into browser-displayable strings
        // migrate this section to displayMap()

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







// seed a cell (x,y) from initial seed
// idea is to move to neighboring cells to have contained shapes

// return the map from this function
// growLoop(-1,-1);
// growLoop(-1,1);
// growLoop(1,-1);
// growLoop(1,1);
// growLoop(0,1); // now it works?
// growLoop(1,0);
// 
// 
// 
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