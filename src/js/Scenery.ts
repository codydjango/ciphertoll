import { ILandscape } from './LandscapeData';
import { Map } from './Map';
import Renderable from './Renderable';

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
    this.drawLayer();
  }

  // old version, linter does not like simple for loops

  // public createLayer(grid: any) {
  //     const sceneryGrid = []
  //     for (let i = 0; i < grid.length; i++) {
  //         const rowItems = grid[i]
  //         let row = ''  // possibly make each row a table?
  //         for (let i = 0; i < rowItems.length; i++) {
  //             row += this.renderSpan(rowItems[i]) // add rendered items to the grid
  //         }
  //         sceneryGrid.push(row)
  //     }
  //     return sceneryGrid
  // }

  // trying with forEach
  public createStringifiedLayer(grid: ILandscape[][]) {
    const sceneryGrid: string[] = [];
    grid.forEach((outerArray: ILandscape[]) => {
      let row = ''; // possibly make each row a table?
      outerArray.forEach((element: ILandscape) => {
        row += this.renderSpan(element); // add rendered items to the grid
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
