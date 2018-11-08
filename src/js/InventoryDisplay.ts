import eventManager from "./eventManager";

class InventoryDisplay {
    constructor() {
        eventManager.subscribe("display-inventory", this.render, this);
        eventManager.subscribe("display-mined", this.renderMined, this);
    }

    public render(inventoryObject: any) {
        let str = inventoryObject.map((item: any) => item.name).join("<br>");
        str = "INVENTORY <br><br>" + str;
        this.set(str, "inventory-status");
    }

    public renderMined(minedElementsObject: any) {
        let str = this.cleanJSONString(JSON.stringify(minedElementsObject));
        str = "PARTICLES MINED <br><br>" + str;
        this.set(str, "mining-status");
    }

    public cleanJSONString(str: any) {
        str = str.replace(/"/g, "");
        str = str.replace(/:/g, " ");
        str = str.replace(/{/g, "");
        str = str.replace(/}/g, "");
        str = str.replace(/,/g, "<br>");

        return str;
    }

    public set(description: any, elementID: string, delay = 0) {
        const el: HTMLElement = document.getElementById(elementID)!; // ! forces compiler to accept non-null reference
        window.setTimeout(() => {
            el.innerHTML = description;
        }, delay);
    }
}

export default InventoryDisplay;
