class ItemData {
    constructor() {
        this.items = this.items()
    }

    items() {
        const particleMiner = {
            name: 'particle miner',
            type: 'item',
            element: '|',
            description: '',
            div: 'item-miner'
        }
        const blueprint = {
            name: 'blueprint',
            type: 'item',
            element: '?',
            description: '',
            div: 'item-blueprint'
        }
        const artificialMuscle = {
            name: 'artificial muscle',
            type: 'item',
            element: '&',
            description: '',
            div: 'item-muscle'
        }
        const printer = {
            name: '3D printer',
            type: 'item',
            element: '#',
            description: '',
            div: 'item-printer'
        }
        return [particleMiner, blueprint, artificialMuscle, printer]
    }
}


export default ItemData
