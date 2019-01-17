import { ILandscape } from '../LandscapeData';
import { Map } from '../Map';
import Moveable from '../Moveable';
import Utility from '../Utility';

import { TOWNS, ITown, ILocation } from './town.data';
import eventManager from '../eventManager';

import { IDirection } from '../MapGenerator';

import { Menu } from '../Menu';

const mapInfo: ILandscape = {
  element: 'X',
  description: '',
  probability: 0,
  cls: 'town',
  particleAmount: 0,
  maxParticles: 0,
  particles: {},
  walkable: true,
};

export class Town extends Moveable {
  public map: Map;
  public mapInfo: ILandscape;
  public x: number;
  public y: number;
  //   public name: string;
  public data: ITown;

  constructor(map: Map) {
    super(map);

    this.map = map;
    this.setMap(map.landscape);

    this.generateTown();
    console.log(this.mapInfo.description); // descriptions different here

    this.placeTownOnMap();
    eventManager.subscribe('access-town', this.enterTown, this);
  }

  generateTown() {
    // get data for map
    this.mapInfo = Object.assign({}, mapInfo);

    // get townData
    const i = Utility.randomize(TOWNS.length);
    this.data = Object.assign({}, TOWNS[i]);
    TOWNS.splice(i, 1);

    this.mapInfo.description = this.data.description;
  }

  placeTownOnMap() {
    this.setInitialPosition();

    this.x = this.initialPosition[0];
    this.y = this.initialPosition[1];
  }

  enterTown(coordinates: IDirection) {
    const { x, y } = coordinates;
    if (this.x == x && this.y == y) {
      const menu = new Menu(this);
      menu.initMenuInput();
      menu.item = this.data.locations[menu.itemIndex];
      console.log(menu.item.description);
      this.selectMenuItem(menu.itemIndex);
    }
  }

  // menu-navigation functions
  // these 4 functions must exist on the calling class in order for Menu to work

  getMenuArray = () => {
    return this.data.locations;
  };

  selectMenuItem = (itemIndex: number) => {
    eventManager.publish('display-town', this.data, itemIndex, null);
  };

  accessMenuItem = (itemIndex: number) => {
    eventManager.publish(
      'display-town',
      this.data,
      itemIndex,
      this.data.locations[itemIndex].description,
    );
  };

  exitMenu = () => {
    eventManager.publish('status', `leaving ${this.data.name}`);
    eventManager.publish('hide-town');
  };
}
