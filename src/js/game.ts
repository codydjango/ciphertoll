import Blueprints from './Blueprints'
import Character from './Character'
import eventManager from './eventManager'
import inventory from './inventory'
import InventoryDisplay from './InventoryDisplay'
import { generateItems } from './items'
import Map from './Map'
import miningInventory from './miningInventory'
import Scenery from './Scenery'
import Status from './Status'
import store from './store'
import UserInput from './UserInput'


const COL = 60
const ROW = 60
const ITEM_NUM = 5

class Game {


    public blueprint: any
    public items: any
    public status: any
    public map: any
    public scenery: any
    public character: any
    public inventory: any
    public miningInventory: any
    public input: any
    public inventoryDisplay: any

    public initGame() {
        let settings

        if (this.hasGameInProgress()) {
            settings = this.resumeSettings()
        } else {
            settings = this.generateSettings()
        }


        const moved = (location: any) => {console.log('location', location)}
        eventManager.subscribe('moved-to', moved)

        this.loadSettings(settings)
        this.startGame()
    }

    public hasGameInProgress() {
        return store.has('map')
    }

    public resumeSettings() {
        const settings = {
            mapData: store.get('map')
        }

        return settings
    }

    public generateSettings() {
        const settings = {
            mapData: {}
        }

        settings.mapData = Map.generate({ col: COL, row:  ROW })

        store.set('map', settings.mapData)

        return settings
    }

    public loadSettings(settings: any) {
        const blueprint = this.blueprint = Blueprints.random()
        const items = this.items = generateItems(ITEM_NUM)

        this.status = new Status()
        this.inventoryDisplay = new InventoryDisplay()

        const map = this.map = new Map(settings.mapData)
        this.scenery = new Scenery(map)
        const character = this.character = new Character(map)

        map.setItems(items)
        map.setCharacter(character)

        this.inventory = inventory
        this.inventory.add(blueprint)
        this.miningInventory = miningInventory

        this.input = this.initUserInput(character)
    }

    public reset() {
        console.log('reset game!')

        eventManager.publish('reset')

        this.initGame()
    }

    public initUserInput(character: any) {
        return new UserInput({
            '78': this.reset.bind(this), // (r) reset map
            '38': character.getAction('move', 'north'),
            '37': character.getAction('move', 'west'),
            '39': character.getAction('move', 'east'),
            '40': character.getAction('move', 'south'),
            '84': character.getAction('take'), // (t)ake item
            '77': character.getAction('mine') // deploy particle (m)iner
        })
    }

    public startGame() {
        this.status.set('you wake up')
        this.status.set(`you are carrying ${this.blueprint.name}`, 4000)
    }
}


export default Game;
