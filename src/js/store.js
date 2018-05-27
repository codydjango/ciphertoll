import eventManager from './eventManager'

class Store {
    constructor() {
        if (typeof window.localStorage === 'undefined') {
            console.log('no localstorage, saving disabled')
            window.alert('saving disabled')
            this.disabled = true
        } else {
            this.disabled = false
            this.storage = window.localStorage
        }

        eventManager.subscribe('reset', this.clear, this)
    }

    clear() {
        this.storage.clear()
    }

    has(key) {
        return (this.storage.getItem(key) !== null)
    }

    set(key, value) {
        console.log('store.set', key)

        this.storage.setItem(key, JSON.stringify(value))
    }

    get(key) {
        console.log('store.get', key)

        return JSON.parse(this.storage.getItem(key))
    }
}


export default new Store()
