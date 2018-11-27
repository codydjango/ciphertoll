import { IActor } from './Character';
import eventManager from './eventManager';
import { ILandscape } from './LandscapeData';
import { Map } from './Map';
import { Renderable } from './Renderable';
import Utility from './Utility';

interface IMove {
  x: number;
  y: number;
}

class Moveable extends Renderable {
  // movement and placement on the grid

  public landscape: ILandscape[][];
  public gridIndices: number[];
  public initialPosition: number[];
  public map: Map;

  constructor(map: Map) {
    super();

    this.map = map;
  }

  public setMap(landscape: ILandscape[][]) {
    this.landscape = landscape;
  }

  public setInitialGridIndices(gridIndices: number[]) {
    this.gridIndices = gridIndices;
  }

  public setInitialPosition() {
    let position = this.map.getRandomMapLocation();

    if (this.checkWalkable(position)) {
      this.initialPosition = position;
    } else {
      this.setInitialPosition();
    }
  }

  public getGridIndices() {
    const x = this.gridIndices[0];
    const y = this.gridIndices[1];

    return { x, y };
  }

  public updateGridIndices(actor: IActor, move: IMove) {
    const newGridIndices = [
      this.gridIndices[0] + move.x,
      this.gridIndices[1] + move.y,
    ];
    let location: ILandscape = this.landscape[this.gridIndices[1]][
      this.gridIndices[0]
    ];

    if (this.checkGridIndices(newGridIndices)) {
      if (this.checkWalkable(newGridIndices)) {
        location = this.landscape[newGridIndices[1]][newGridIndices[0]];
        this.gridIndices = newGridIndices;
        actor.x = newGridIndices[0];
        actor.y = newGridIndices[1];
      } else {
        eventManager.publish('status', 'this area is unwalkable');
      }
    } else if (actor.name === 'character') {
      eventManager.publish('status', "you've reached the map's edge");
    }

    return location;
  }

  public checkGridIndices(newGridIndices: number[]) {
    let locationOnGrid = false;

    const y = newGridIndices[1];
    const x = newGridIndices[0];

    if (this.landscape[y]) {
      const location = this.landscape[y][x];
      if (location) {
        locationOnGrid = true;
      }
    }

    return locationOnGrid;
  }

  public checkWalkable(newGridIndices: number[]) {
    let walkable = false;

    const y = newGridIndices[1];
    const x = newGridIndices[0];

    if (this.landscape[y]) {
      walkable = this.landscape[y][x].walkable;
    }

    return walkable;
  }

  public getCSSHeightAndWidth() {
    const el = document.querySelector('.unit')!; // force non-null
    const style = window.getComputedStyle(el);
    const width = Utility.stringToNumber(style.getPropertyValue('width'));
    const height = Utility.stringToNumber(style.getPropertyValue('height'));
    return { width, height };
  }

  public getCSSCoordinates() {
    const css = this.getCSSHeightAndWidth();
    // +1 to gridIndices prevents left-side bug in movement display,
    // but shifts the character's display grid over to the left and down ...
    // possibly try shifting entire grid over ???
    // so that we're not mulitplying the css.width etc by ZERO
    const left = this.gridIndices[0] * css.height;
    const top = this.gridIndices[1] * css.width;
    return { left, top };
  }
}

export default Moveable;
