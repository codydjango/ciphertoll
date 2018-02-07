class Space {
    constructor() {
        console.log('creating space!')
    }

    explore() {
        console.log('exploring!')
    }

    
}


class Game {
    constructor() {
        this.initGame()
        this.startGame()
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

    initGame() {
        this.spaces = [];
        this.generateSpace();
        this.gameOver = false;
        this.populateMap();
    }




    generateSpace() {
        this.addSpace(new Space())
    }

    addSpace(space) {
        this.spaces.push(space)
    }


    generateMap(col, row) {

        // create array of size x, y
        // populate with values of y

        // should i be defining all these variables as this.map etc??

        let map = [];
        for (let i = 0; i < row; i++) {
            map[i] = [];
            for (let j = 0; j < col; j++)
            map[i].push(j);
        }
        return map;
    }


    populateMap() {

        // 1. generate an empty map

        let col = 10;  // map size
        let row = 10;
        let array2d = this.generateMap(col, row);

        // 2. seed map with initial elements

        let landscapeElements = ['t', 'M', '.']; // trees, mountains, plains (?)
        let numberOfUniqueElements = ((col * row) / (col + row));  // sparse initial seeding
        let xSeeded = [];  // track seed locations
        let ySeeded = [];

        for (let i = 0; i < numberOfUniqueElements; i++) {

            // find random location on map
            let xSeed = Math.floor(Math.random() * col);
            let ySeed = Math.floor(Math.random() * row);

            // get random element from available elements
            let randomElementIndex = Math.floor(Math.random() * landscapeElements.length);
            let randomElement = landscapeElements[randomElementIndex];
            
            // inject element into map

            if (array2d[xSeed][ySeed] !== NaN) {  // if location !alreadySeeded
                array2d[xSeed][ySeed] = randomElement;
                xSeeded.push(xSeed);  // track seed locations
                ySeeded.push(ySeed);
            }

        }


        // 2. grow element territories from seeds


        let mapPopulated = false;   // loop until entire map is filled
        // while (!mapPopulated) {
        // }



        function growLoop(xIncrement, yIncrement) { // add probability arg (?)


            for (let j = 0; j < xSeeded.length; j++) {
                let probability = Math.floor(Math.random() * 3);  // likelihood of growing from seed
                let x = xSeeded[j];
                let y = ySeeded[j];
                let growSource = array2d[x][y]; // find a seeded location

                if (array2d[x + xIncrement] === undefined) {  // returns undefined if try seeding beyond map edges
                    break  // would rather not break ... just skip to the next one
    
                } else if (array2d[x + xIncrement][y + yIncrement] !== NaN) {
                    if (probability === 0) { // 66% chance
                        console.log('probability check ' + j);
                        array2d[x + xIncrement][y + yIncrement] = growSource;  // assign neighboring location seed
                        xSeeded.push(x + xIncrement); // adding the new seed location
                        ySeeded.push(y + yIncrement);
                    }
                }
            }
        }


        // seed a cell (x,y) from initial seed
        // idea is to move to neighboring cells to have contained shapes

        growLoop(-1,1);
        growLoop(-1,-1);
        growLoop(1,-1);
        growLoop(1,1);
        // growLoop(0,1); // motion in just one direction freezes browser?
        // growLoop(1,0);












        // convert 2D array map into browser-displayable strings

        let array1d = [];
        for (let i = 0; i < array2d.length; i++) {
            array1d.push(array2d[i].join(''));
        }
        let mapDisplay = array1d.join('<br />');
        let map = document.getElementById('map');
        map.innerHTML = mapDisplay;

        // console.log(mapDisplay);



    }




    displaySpace() {
        this.generateSpace()
    }
}


window.game = new Game();