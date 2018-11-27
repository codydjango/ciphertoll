import eventManager from '../eventManager';
import Moveable from '../Moveable';
import Utility from '../Utility';
import { ILandscape } from '../LandscapeData';
import { Map } from '../Map';

// const ITEMS = {
//     miner: {
//         name: 'particle miner',
//         type: 'item',
//         element: '|',
//         description: 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.',
//         div: 'item-miner'
//     },
//     parser: {
//         name: 'noise parser',
//         type: 'item',
//         element: '?',
//         description: 'prototype. parses atmospheric data for latent information. signal-to-noise ratio not guaranteed.',
//         div: 'item-parser'
//     },
//     interface: {
//         name: 'psionic interface',
//         type: 'item',
//         element: '&',
//         description: `connects seamlessly to a standard-issue bioport. facilitates sundry interactions performed via PSI-NET.`,
//         div: 'item-interface'
//     },
//     printer: {
//         name: 'molecular printer',
//         type: 'item',
//         element: '#',
//         description: 'generates objects according to a blueprint. molecules not included.',
//         div: 'item-printer'
//     }
// }

class Item extends Moveable {
  public identityNumber: number;
  public type: string;
  public offMap: boolean;
  public left: number;
  public top: number;
  public x: any;
  public y: any;
  public div: any;
  public name: string;
  public divSet: any;

  constructor(map: Map) {
    // removed itemConfig param from constructor
    super(map);

    // merge in config properties
    // const target = Object.assign(this, itemConfig)

    // additional properties
    this.identityNumber = Utility.Id();
    this.type = 'item';
    this.offMap = false;
    // this.inInventory = false
  }

  public setOnMap(location: number[]) {
    // const landscape = this.map.landscape;
    // this.setMap(landscape);

    // this.setInitialPosition();

    this.setInitialGridIndices(location);
    this.setCoordinates();
    this.setGridIndices();
    this.setDiv(this.getId());
    this.updateDiv(this);

    // moved this out so we are not creating children each time we want to place on map
    // this.createInitialChildElement('item-layer')
  }

  public getId() {
    return this.identityNumber;
  }

  public setCoordinates() {
    const { cssLeft, cssTop } = this.getCSSCoordinates();
    this.left = cssLeft;
    this.top = cssTop;
  }

  public setGridIndices() {
    const { x, y } = this.getGridIndices();

    this.x = x;
    this.y = y;
  }

  public setDiv(identityNumber: any) {
    if (!this.divSet) {
      this.div = this.div + identityNumber;
    }
    this.divSet = true;
  }

  // specific to item drawing: use outerHTML
  public drawLayer(layerId: any) {
    const el = document.getElementById(layerId)!;
    el.outerHTML = this.getLayer();
  }

  public renderLayer(unit: any, layerId: any) {
    if (unit.type === 'item') {
      this.updateDiv(unit);
      this.drawLayer(layerId);
    }
  }

  public onTake() {
    this.x = null;
    this.y = null;
    this.offMap = true; // changes css display to 'none'

    switch (this.name) {
      case 'particle miner':
        // this.haltMining()
        console.log('call haltMining here'); // cannot call child method from parent class ...
        break;
    }

    eventManager.publish('add-inventory', this);
    // eventManager.subscribe('remove-inventory', this.onDrop, this)
    this.renderLayer(this, this.div);
  }

  public onDrop() {
    eventManager.subscribe(
      `${this.name}-${this.identityNumber} taken`,
      this.onTake,
      this,
      true,
    );
    //     this.renderLayer(this, this.div)
  }
}

export default Item;
