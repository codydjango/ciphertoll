class Status {
    constructor(eventManager) {
        this.EM = eventManager
        this.EM.subscribe('character-moved', this.update, this)
        this.EM.subscribe('item-status', this.displayItem, this)
    }

    update(location) {
        this.set(location.description)
    }

    displayItem(itemName) {
        this.set(`you see ${itemName} here`, 10)
        this.EM.subscribe('character-moved', this.update, this)
    }

    set(description, delay=0) {
        window.setTimeout(() => {
            document.getElementById('status').innerHTML = description
        }, delay)
    }
}


export default Status
