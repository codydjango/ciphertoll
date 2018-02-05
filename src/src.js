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
        this.spaces = []
        this.generateSpace()
        this.gameOver = false
    }

    generateSpace() {
        this.addSpace(new Space())
    }

    addSpace(space) {
        this.spaces.push(space)
    }
}


window.game = new Game()