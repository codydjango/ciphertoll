import { ILandscape } from './LandscapeData';
import { Map } from './Map';
import { Renderable } from './Renderable';

class Scenery extends Renderable {
  // Scenery-specific rendering functions

  public map: ILandscape[][];

  constructor(map: Map) {
    super();
    this.map = map.getMap();
    this.renderLayer();
    console.log('scenery rendered');
  }

  public renderLayer() {
    const grid = this.map.map(arr => arr.slice());
    this.setLayer(this.createStringifiedLayer(grid));
    this.drawLayer(); // shadowed method
  }

  //   const { left, top } = this.getCSSCoordinates({ x, y });
  //   this.left = left;
  //   this.top = top;

  // get coordinates for each element in the array and assign them
  // draw each element on the screen according to its left and top

  // trying with forEach
  public createStringifiedLayer(grid: ILandscape[][]) {
    console.log(grid);
    const sceneryGrid: string[] = [];
    grid.forEach((outerArray: ILandscape[]) => {
      let row = ''; // possibly make each row a table?
      outerArray.forEach((element: ILandscape) => {
        row += this.renderSpan(element); // uses Renderable.renderSpan here
      });
      sceneryGrid.push(row);
    });

    return sceneryGrid;
  }

  public drawLayer() {
    // shadows Renderable.drawLayer()
    const layer: string[] = this.getLayer();
    const gridToHTML = layer.join('<br />'); // using HTML breaks for now
    const el = document.getElementById('landscape-layer')!;
    el.innerHTML = gridToHTML;
  }
}

export default Scenery;
