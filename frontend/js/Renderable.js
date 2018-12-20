class Renderable {  // generalized render functions for Scenery, Character
    constructor() {
    }

    setLayer(layer) {
        this.layer = layer
    }

    getLayer() {
        return this.layer
    }

    renderSpan(unit) {
        let cls = ''
        let element = '&nbsp;'
        let style = ''
        if (unit) {
            cls = unit.cls
            element = unit.element
        }

        if (unit.top && unit.left) {
            style = `top: ${unit.top}px; left: ${unit.left}px`
        }
        return `<span class="unit ${cls}" style="${style}">${element}</span>`
    }

    renderDiv(item) {
        let div = ''
        let element = '&nbsp;'
        let style = ''
        if (item) {
            div = item.div
            element = item.element
        }
        if (item.top && item.left) {
            style = `top: ${item.top}px; left: ${item.left}px; position: absolute`
        }
        if (item.offMap) {
            style += `; display: none`
        }

        switch (item.mining) {
            case 'full':
                style += `; animation: mining-full 3s infinite`
                break
            case 'half':
                style += `; animation: mining-half 3s infinite`
                break
            case 'empty':
                style += `; animation: mining-empty 3s infinite`
                break
        }

        return `<div id="${div}" style="${style}">${element}</div>`
    }

    updateSpan(actor) {
        this.setLayer(this.renderSpan(actor))
    }

    updateDiv(item) {
        this.setLayer(this.renderDiv(item))
    }

    drawLayer(layerId) {
        const el = document.getElementById(layerId)
        el.innerHTML = this.getLayer()
    }

    createInitialChildElement(parentLayerId) {
        const el = document.getElementById(parentLayerId)
        const child = document.createElement('div') // creates div id within enclosing div ...
        child.innerHTML = this.getLayer()
        el.appendChild(child)
    }
}



export default Renderable
