import { DIRECTIONS } from './Constants'
import eventManager from './eventManager'
import inventory from './inventory'
import Moveable from './Moveable'


class Character extends Moveable {  // Character data and actions
    public mapInstance: any
    public initialPosition: any
    public EM: any
    public inventory: any
    public location: any
    
    constructor(mapInstance: any, initialPosition?: any) {
        super(mapInstance)

        this.mapInstance = mapInstance
        this.initialPosition = initialPosition

        this.initSettings()
        this.render()

        console.log('character rendered')
    }

    public initSettings() {
        this.EM = eventManager
        this.inventory = inventory
        this.setInitialGridIndices(this.getPosition())
    }

    public render() {
        this.updateSpan(this.getCharacter())
        this.drawLayer('character-layer')
    }

    public getPosition(): any {
        let position
        this.initialPosition ? position = this.initialPosition : position = this.mapInstance.getMapCenter()
        return position
    }

    public getCharacter(): any {
        const { cssLeft, cssTop } = this.getCSSCoordinates()
        const { x, y } = this.getGridIndices()
        const character = {
            name: 'character',
            type: 'actor',
            element: '@',
            cls: 'character',
            left: cssLeft,
            top: cssTop,
            x,
            y,
        }
        return character
    }

    public  getAction(fnName: any, arg: any): any {
        return this[fnName].bind(this, arg)
    }

    public move(direction: any) {
        this.location = this.updateGridIndices(this.getCharacter(), DIRECTIONS[direction])
        this.printLocalStatus()
        this.render()

        const position = {
            x: this.location.x,
            y: this.location.y
        }

        this.EM.publish('moved-to', position)
    }

    public printLocalStatus() {
        this.EM.publish('character-moved', this.location)
        const localItem = this.getLocalItem()

        if (localItem) {
            if (localItem.mining === 'empty') {
                this.EM.publish('status', 'mining has been exhausted for this region')
            } else if (localItem.mining) {
                this.EM.publish('status', 'a miner pulls compounds from the region')
            } else {
                this.EM.publish('display-item', localItem.name)
            }
        }
    }

    public getLocalItem(): any {
        const char = this.getCharacter()
        let localItem = null
        this.mapInstance.itemsOnMap.forEach((item: any) => {
            if (item.x === char.x && item.y === char.y) {
                localItem = item
            }})
        return localItem
    }

    public take() {
        const localItem = this.getLocalItem()

        if (localItem) {
            this.EM.publish(`${localItem.name}-${localItem.identityNumber} taken`)
            this.EM.publish('status', `${localItem.name} taken`)
        } else {
            this.EM.publish('status', 'there is nothing here worth taking')
        }
    }

    public getItemLocation(itemName: any): any {
        const char = this.getCharacter()
        const itself = this.inventory.retrieveItem(itemName)
        const location = [char.x, char.y]
        return { itself, location }
    }

    public mine() {
        const miner = this.getItemLocation('particle miner')
        if (miner.itself) {
            miner.itself.mine(miner.location)
            this.EM.publish('remove-inventory', miner.itself)
        } else {
            this.EM.publish('status', 'you do not have any particle miners')
        }
    }
}


export default Character
