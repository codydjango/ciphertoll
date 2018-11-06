class Renderable {  // generalized render functions for Scenery, Character

    public layer: any

    public setLayer(layer: any) {
        this.layer = layer
    }

    public getLayer() {
        return this.layer
    }

    public renderSpan(unit: any) {
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

    public renderDiv(item: any) {
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

    public updateSpan(actor: any) {
        this.setLayer(this.renderSpan(actor))
    }

    public updateDiv(item: any) {
        this.setLayer(this.renderDiv(item))
    }

    public drawLayer(layerId: any) {
        const el = document.getElementById(layerId)!
        el.innerHTML = this.getLayer()
    }

    public createInitialChildElement(parentLayerId: any) {
        const el = document.getElementById(parentLayerId)! // force non-null
        const child = document.createElement('div') // creates div id within enclosing div ...
        child.innerHTML = this.getLayer()
        el.appendChild(child)
    }
}



export default Renderable
