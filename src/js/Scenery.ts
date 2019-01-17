import { ILandscape } from './LandscapeData';
import { Map } from './Map';
import { Renderable } from './Renderable';

class Scenery extends Renderable {
  // Scenery-specific rendering functions

  public landscape: ILandscape[][];

  constructor(map: Map) {
    super();
    this.landscape = map.getMap();
    this.renderLayer();
    console.log('scenery rendered');
  }

  public renderLayer() {
    const grid = this.landscape.map(arr => arr.slice());
    this.setLayer(this.createStringifiedLayer(grid));
    this.drawLayer();
  }

  public createStringifiedLayer(grid: ILandscape[][]) {
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
    const layer: string[] = this.getLayer();

    const gridToHTML = layer.join('<br />'); // using HTML breaks for now
    const el = document.getElementById('landscape-layer')!;
    el.innerHTML = gridToHTML;
  }
}

export default Scenery;
