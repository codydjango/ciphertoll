class Map {

    constructor(col, row) {
        console.log('creating map')

    }
}

class Game {
    constructor() {
        this.initGame()
        this.startGame()
    }

    initGame() {
        this.spaces = [];
        this.generateSpace();
        this.gameOver = false;
        const map = this.instantiateEmptyMap(10,10)
        this.renderMap(map)
        console.log(map)
//        this.populateMap();
    }

    startGame() {
        while (!this.gameIsOver()) {
            this.giveOptionForAction()
        }
    }

    gameIsOver() {
        return this.gameOver
    }

    giveOptionForAction() {
        // if (window.prompt('Exit?', 'Sure') === 'Sure') {
            this.gameOver = true
        // }

        // actions could have constraints, such as
        //     -only can take one action of this type at a time
        //     - action requires cooldown
        //     - action requires prep
        //     - action costs resources


        // ask player for action
        // process action
        // calculate stats
    }


    explore() {
        console.log(`exploring the ${this.kind} zone!`)
    }

    generateSpace() {
        this.addSpace(new Space())
    }


    addSpace(space) {
        this.spaces.push(space)
    }


    instantiateEmptyMap(col, row) {

        // create array of size x, y
        // populate with value '.'

        const map = [];
        for (let i = 0; i < row; i++) {
            map[i] = [];
            for (let j = 0; j < col; j++) {
                map[i].push('.');
            }
        }
        return map;
    }


    populateMap() {

        // 1. generate an empty map

        const col =10;  // map size
        const row = 10;
        const array2d = this.generateMap(col, row);

        // 2. seed map with initial elements

        const landscapeElements = ['t', 'M', '.']; // trees, mountains, plains (?)
        const numberOfUniqueElements = 20;  // rich initial seeding
        // const numberOfUniqueElements = ((col * row) / (col + row));  // sparse initial seeding

        const xSeeded = [];  // track seed locations
        const ySeeded = [];

        for (let i = 0; i < numberOfUniqueElements; i++) {

            // find random location on map
            const xSeed = Math.floor(Math.random() * col);
            const ySeed = Math.floor(Math.random() * row);

            // get random element from available elements
            const randomElementIndex = Math.floor(Math.random() * landscapeElements.length);
            const randomElement = landscapeElements[randomElementIndex];
            
            // inject element into map

            if (array2d[xSeed][ySeed] !== NaN) {  // if location !alreadySeeded
                array2d[xSeed][ySeed] = randomElement;
                xSeeded.push(xSeed);  // track seed locations
                ySeeded.push(ySeed);
            }

        }


        // 2. grow element territories from seeds


        // loop until entire map is filled:
        // let mapPopulated = false;   
        // while (!mapPopulated) {

        // }

/*
        function growLoop(xIncrement, yIncrement) { // add probability arg (?)


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

*/
        // seed a cell (x,y) from initial seed
        // idea is to move to neighboring cells to have contained shapes
/*

        growLoop(-1,-1);
        growLoop(-1,1);
        growLoop(1,-1);
        growLoop(1,1);
        growLoop(0,1); // now it works?
        growLoop(1,0);

*/

        // return the map from this function



 


    }


    renderMap(instantiatedMap) {
        // convert 2D array map into browser-displayable strings
        // migrate this section to displayMap()

        const condensedMap = [];
        for (let i = 0; i < instantiatedMap.length; i++) {
            condensedMap.push(instantiatedMap[i].join(''));
        }
        const renderedMap = condensedMap.join('<br />');
        const el = document.getElementById('map');
        el.innerHTML = renderedMap;
        // console.log(mapDisplay);

    }


    displaySpace() {
        this.generateSpace()
    }
}


window.game = new Game();