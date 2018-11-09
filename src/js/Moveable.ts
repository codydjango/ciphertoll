import { IActor } from "./Character";
import eventManager from "./eventManager";
import { ILandscape } from "./LandscapeData";
import { Map } from "./Map";
import Renderable from "./Renderable";
import Utility from "./Utility";

interface IMove {
    x: number;
    y: number;
}

class Moveable extends Renderable {
    // movement and placement on the grid

    public landscape: ILandscape[][];
    public gridIndices: number[];

    constructor(map?: Map) {
        super();
    }

    public setMap(landscape: ILandscape[][]) {
        this.landscape = landscape;
    }

    public setInitialGridIndices(gridIndices: number[]) {
        this.gridIndices = gridIndices;
    }

    public getGridIndices() {
        const x = this.gridIndices[0];
        const y = this.gridIndices[1];

        return { x, y };
    }

    public updateGridIndices(actor: IActor, move: IMove) {
        const newGridIndices = [
            this.gridIndices[0] + move.x,
            this.gridIndices[1] + move.y
        ];
        let location: ILandscape = this.landscape[this.gridIndices[1]][
            this.gridIndices[0]
        ];
        if (this.checkGridIndices(newGridIndices)) {
            location = this.landscape[newGridIndices[1]][newGridIndices[0]];
            this.gridIndices = newGridIndices;
            actor.x = newGridIndices[0];
            actor.y = newGridIndices[1];
        } else if (actor.name === "character") {
            eventManager.publish("status", "you've reached the map's edge");
        }

        return location;
    }

    public checkGridIndices(newGridIndices: number[]) {
        let locationOnGrid = false;

        const x = newGridIndices[1];
        const y = newGridIndices[0];

        if (this.landscape[x]) {
            const location = this.landscape[x][y];
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
        // +1 to gridIndices prevents left-side bug in movement display,
        // but shifts the character's display grid over to the left and down ...
        // possibly try shifting entire grid over ???
        // so that we're not mulitplying the css.width etc by ZERO
        const cssLeft = this.gridIndices[0] * css.height;
        const cssTop = this.gridIndices[1] * css.width;
        return { cssLeft, cssTop };
    }
}

export default Moveable;
