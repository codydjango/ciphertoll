import eventManager from './eventManager'

class InventoryDisplay {
    constructor() {
        this.EM = eventManager
        this.EM.subscribe('display-inventory', this.render, this)
        this.EM.subscribe('display-mined', this.renderMined, this)
    }

    render(inventoryObject) {
        let str = inventoryObject.map(item => item.name).join('<br>')
        str = 'INVENTORY <br><br>' + str
        this.set(str, 'inventory-status')
    }

    renderMined(minedElementsObject) {
        let str = this.cleanJSONString(JSON.stringify(minedElementsObject))
        str = 'PARTICLES MINED <br><br>' + str
        this.set(str, 'mining-status')
    }

    cleanJSONString(str) {
        str = str.replace(/"/g, '')
        str = str.replace(/:/g, ' ')
        str = str.replace(/{/g, '')
        str = str.replace(/}/g, '')
        str = str.replace(/,/g, '<br>')

        return str
    }

    set(description, elementID, delay=0) {
        window.setTimeout(() => {
            document.getElementById(elementID).innerHTML = description
        }, delay)
    }

}


export default InventoryDisplay
