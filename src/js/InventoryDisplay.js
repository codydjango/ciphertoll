import eventManager from './eventManager'

class InventoryDisplay {
    constructor() {
        this.EM = eventManager
        this.EM.subscribe('display-inventory', this.displayInventory, this)
        this.EM.subscribe('display-mined', this.displayMined, this)
    }



    displayMined(minedElementsObject) {

        let str = this.cleanJSONString(JSON.stringify(minedElementsObject))

        str = 'PARTICLES MINED <br><br>' + str

        this.set(str)
    }


    cleanJSONString(str) {
        str = str.replace(/"/g, '')
        str = str.replace(/:/g, ' ')
        str = str.replace(/{/g, '')
        str = str.replace(/}/g, '')
        str = str.replace(/,/g, '<br>')

        return str
    }





    displayInventory(inventoryObject) {
        this.set(inventoryObject, 10)
    }


    set(description, delay=0) {
        window.setTimeout(() => {
            document.getElementById('inventoryDisplay').innerHTML = description
        }, delay)
    }
}


export default InventoryDisplay
