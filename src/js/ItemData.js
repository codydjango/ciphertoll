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
        const noiseParser = {
            name: 'noise parser',
            type: 'item',
            element: '?',
            description: '',
            div: 'item-parser'
        }
        const psionicInterface = {
            name: 'psionic interface',
            type: 'item',
            element: '&',
            description: '',
            div: 'item-interface'
        }
        const molecularPrinter = {
            name: 'molecular printer',
            type: 'item',
            element: '#',
            description: '',
            div: 'item-printer'
        }
        return [particleMiner, noiseParser, psionicInterface, molecularPrinter]
    }
}


export default ItemData
