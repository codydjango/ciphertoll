import Map from './Map'
import Scenery from './Scenery'
import Character from './Character'
import eventManager from './eventManager'
import Status from './Status'
import UserInput from './UserInput'
import Blueprints from './Blueprints'
import inventory from './inventory'
import Item from './Item'


class Game {
    constructor() {
        this.initGame()
        this.startGame()
    }

    initGame() {
        // this.spaces = []
        // this.gameOver = false

        this.status = new Status()
        const map = new Map(60, 60)
        const items = Item.generate(5)

        this.scenery = new Scenery(map)

        map.setItems(items)

        const character = new Character(map)
        this.character = character

        map.setCharacter(character)
        // character.subscribeItemsToMap()  // not currently necessary

        this.blueprint = Blueprints.random()

        this.inventory = inventory
        this.inventory.add(this.blueprint)

        this.input = this.initUserInput(character)
    }

    initUserInput(character) {
        return new UserInput({
            '38': character.getAction('move', 'north'),
            '37': character.getAction('move', 'west'),
            '39': character.getAction('move', 'east'),
            '40': character.getAction('move', 'south'),
            '84': character.getAction('take'), // (t)ake item
            '73': character.getAction('checkInventory') // check (i)nventory
        })
    }

    startGame() {
        this.status.set('you wake up')
        this.status.set(`you are carrying ${this.blueprint.name}`, 4000)
    }

    // gameIsOver() {
    //     return this.gameOver
    // }

    // explore() {
    //     console.log(`exploring the ${this.kind} zone!`)
    // }
}


export default new Game();
