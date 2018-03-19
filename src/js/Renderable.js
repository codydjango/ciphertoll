class Renderable {  // generalized render functions for Scenery, Character
    constructor() {
    }

    setLayer(layer) {
        this.layer = layer
    }

    getLayer() {
        return this.layer
    }

    renderUnit(unit) {      // issue when ITEMS are rendered: cannot render multiple items on one layer??
        let cls = ''
        let element = '&nbsp;'
        if (unit) {
            cls = unit.cls
            element = unit.element
        }
        let style = ''
        if (unit.top && unit.left) {
            style = `top: ${unit.top}px; left: ${unit.left}px`
        }
        return `<span class="unit ${cls}" style="${style}">${element}</span>`
    }
}


export default Renderable
