import eventManager from './eventManager'

class InventoryDisplay {
    constructor() {
        this.EM = eventManager
        this.EM.subscribe('display-inventory', this.displayInventory, this)
        this.EM.subscribe('display-mined', this.displayMined, this)
    }



    displayMined(minedElementsObject) {

        const str = this.cleanJSONString(JSON.stringify(minedElementsObject))

        this.set(str, 10)
    }


    cleanJSONString(string) {
        string = string.replace(/"/g, '')
        string = string.replace(/:/g, ' ')
        string = string.replace(/{/g, '')
        string = string.replace(/}/g, '')
        // string = string.replace(/,/g, ' | ')
        string = string.replace(/,/g, '<br>')

        return string
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
