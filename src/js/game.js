import Map from './Map'
import Scenery from './Scenery'
import Character from './Character'
import eventManager from './eventManager'
import Status from './Status'
import UserInput from './UserInput'
import Blueprints from './Blueprints'
import inventory from './inventory'
import { generateItems } from './items'
import store from './store'

const COL = 60
const ROW = 60
const ITEM_NUM = 5

class Game {
    constructor() {
        this.initGame()
    }

    initGame() {
        let settings

        if (this.hasGameInProgress()) {
            settings = this.resumeSettings()
        } else {
            settings = this.generateSettings()
        }

        this.loadSettings(settings)
        this.startGame()
    }

    hasGameInProgress() {
        return store.has('map')
    }

    resumeSettings() {
        const settings = {
            mapData: store.get('map')
        }

        return settings
    }

    generateSettings() {
        const settings = {}

        settings.mapData = Map.generate({ col: COL, row:  ROW })

        store.set('map', settings.mapData)

        return settings
    }

    loadSettings(settings) {
        const blueprint = this.blueprint = Blueprints.random()
        const items = this.items = generateItems(ITEM_NUM)

        const status = this.status = new Status()

        const map = this.map = new Map(settings.mapData)
        const scenery = this.scenery = new Scenery(map)
        const character = this.character = new Character(map)

        map.setItems(items)
        map.setCharacter(character)

        this.inventory = inventory
        this.inventory.add(blueprint)

        this.input = this.initUserInput(character)
    }

    reset() {
        console.log('reset map!')

        store.clear()

        this.initGame()
    }

    initUserInput(character) {
        return new UserInput({
            '82': this.reset.bind(this), // (r) reset map
            '38': character.getAction('move', 'north'),
            '37': character.getAction('move', 'west'),
            '39': character.getAction('move', 'east'),
            '40': character.getAction('move', 'south'),
            '84': character.getAction('take'), // (t)ake item
            '73': character.getAction('checkInventory'), // check (i)nventory
            '77': character.getAction('mine') // deploy particle (m)iner
        })
    }

    startGame() {
        this.status.set('you wake up')
        this.status.set(`you are carrying ${this.blueprint.name}`, 4000)
    }
}


export default new Game();
