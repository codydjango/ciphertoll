class ItemData {
    constructor() {
        this.items = this.items()
    }

    items() {
        const particleMiner = {
            name: 'particle miner',
            element: '|',
            description: '',
            cls: 'item miner'
        }
        const blueprint = {
            name: 'blueprint',
            element: '?',
            description: '',
            cls: 'item blueprint'
        }
        const artificialMuscle = {
            name: 'artificial muscle',
            element: '&',
            description: '',
            cls: 'item muscle'
        }
        const printer = {
            name: '3D printer',
            element: '#',
            description: '',
            cls: 'item printer'
        }
        return [particleMiner, blueprint, artificialMuscle, printer]
    }
}


export default ItemData