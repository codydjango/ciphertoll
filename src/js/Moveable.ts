import eventManager from "./eventManager";
import Renderable from "./Renderable";
import Utility from "./Utility";

class Moveable extends Renderable {
    // movement and placement on the grid

    public map: any;
    public gridIndices: any;

    constructor(mapInstance?: any) {
        super();
    }

    public setMap(map: any) {
        this.map = map;
    }

    public setInitialGridIndices(gridIndices: any) {
        this.gridIndices = gridIndices;
    }

    public getGridIndices() {
        const x = this.gridIndices[0];
        const y = this.gridIndices[1];

        return { x, y };
    }

    public updateGridIndices(actor: any, move: any) {
        const newGridIndices = [
            this.gridIndices[0] + move.x,
            this.gridIndices[1] + move.y
        ];
        let location = "";
        if (this.checkGridIndices(newGridIndices)) {
            location = this.map[newGridIndices[1]][newGridIndices[0]];
            this.gridIndices = newGridIndices;
            actor.x = newGridIndices[0];
            actor.y = newGridIndices[1];
        } else {
            location = this.map[this.gridIndices[1]][this.gridIndices[0]];
            if (actor.name === "character") {
                eventManager.publish("status", "you've reached the map's edge");
            }
        }
        return location;
    }

    public checkGridIndices(newGridIndices: any) {
        let locationOnGrid = false;

        const x = newGridIndices[1];
        const y = newGridIndices[0];

        if (this.map[x]) {
            const location = this.map[x][y];
            if (location) {
                locationOnGrid = true;
            }
        }

        return locationOnGrid;
    }

    public getCSSHeightAndWidth() {
        console.log(document);
        const el = document.querySelector(".unit")!; // force non-null
        console.log(el);
        const style = window.getComputedStyle(el);
        const width = Utility.stringToNumber(style.getPropertyValue("width"));
        const height = Utility.stringToNumber(style.getPropertyValue("height"));
        return { width, height };
    }

    public getCSSCoordinates() {
        const css = this.getCSSHeightAndWidth();
        const cssLeft = this.gridIndices[0] * css.height;
        const cssTop = this.gridIndices[1] * css.width;
        return { cssLeft, cssTop };
    }
}

export default Moveable;
