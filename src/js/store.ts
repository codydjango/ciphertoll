import eventManager from './eventManager'

class Store {

    public disabled: any
    public storage: any

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

    public clear() {
        this.storage.clear()
    }

    public has(key: any) {
        return (this.storage.getItem(key) !== null)
    }

    public set(key: any, value: any) {
        console.log('store.set', key)

        this.storage.setItem(key, JSON.stringify(value))
    }

    public get(key: any): any {
        console.log('store.get', key)

        return JSON.parse(this.storage.getItem(key))
    }
}


export default new Store()
