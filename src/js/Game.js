import Map from './Map'
import Scenery from './Scenery'
import Character from './Character'
import EventManager from './EventManager'
import ItemGenerator from './ItemGenerator'
import Status from './Status'
import UserInput from './UserInput'
import Blueprints from './Blueprints'


class Game {
    constructor() {
        this.initGame()
        this.startGame()
    }

    initGame() {
        this.spaces = []
        this.gameOver = false
        this.map = new Map(60, 60)
        this.scenery = new Scenery(this.map)
        this.character = new Character(this.map)
        this.map.setCharacter(this.character)  // gives map reference to character


        // eventmanager testing
        this.EM = new EventManager()  // create only one EM ? or multiple ?
        this.character.setEventManager(this.EM)
        this.map.setEventManager(this.EM)

        // try generating from a set of stock items
        // bug: only the last item generated will display!!
        // testing with one item generated ...
        this.itemGenerator = new ItemGenerator(this.map, this.EM, 5)  // have to pass in EM to generator (inelegant)

        this.status = new Status(this.EM)
        this.status.set('you wake up')
        this.blueprint = Blueprints.random()
        this.status.set(`you are carrying ${this.blueprint.name}`, 4000)

        this.input = this.initUserInput()
    }

    initUserInput() {
        return new UserInput({
            '38': this.character.getAction('move', 'north'),
            '37': this.character.getAction('move', 'west'),
            '39': this.character.getAction('move', 'east'),
            '40': this.character.getAction('move', 'south'),
            '84': this.character.getAction('takeItem', 'item') // (t)ake item
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


export default new Game();
