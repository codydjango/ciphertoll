import { ILandscape } from '../LandscapeData';
import { Map } from '../Map';
import Moveable from '../Moveable';
import Utility from '../Utility';

import { TOWNS, ITown, ILocation } from './town.data';
import eventManager from '../eventManager';

import { IDirection } from '../MapGenerator';
import UserInput from '../UserInput';

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

  //menu properties
  public menuItemIndex: number;
  public menuItem: ILocation;

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
      // menu navigation
      this.initTownInput();
      this.menuItemIndex = 0;
      this.menuItem = this.data.locations[this.menuItemIndex];
      console.log(this.menuItem.description);
      eventManager.publish('display-town', this.data, this.menuItemIndex, null);
    }
  }

  // generalized menu controls ... could abstract from class?

  nextMenuItem = () => {
    if (!this.toggle) {
      this.menuItemIndex =
        (this.menuItemIndex + 1) % this.data.locations.length;
      this.menuItem = this.data.locations[this.menuItemIndex];
      eventManager.publish('display-town', this.data, this.menuItemIndex, null);

      console.log(this.menuItemIndex);
    }
  };

  previousMenuItem = () => {
    if (!this.toggle) {
      this.menuItemIndex = this.menuItemIndex - 1;
      if (this.menuItemIndex < 0) {
        this.menuItemIndex = this.data.locations.length - 1;
      }
      this.menuItem = this.data.locations[this.menuItemIndex];
      eventManager.publish('display-town', this.data, this.menuItemIndex, null);

      console.log(this.menuItemIndex);
    }
  };

  public toggle = false;

  accessMenuItem = () => {
    console.log('access');
    console.log(this.menuItem.description);
    if (!this.toggle) {
      eventManager.publish(
        'display-town',
        this.data,
        this.menuItemIndex,
        this.menuItem.description,
      );
      this.toggle = !this.toggle;
    } else {
      eventManager.publish('display-town', this.data, this.menuItemIndex, null);
      this.toggle = !this.toggle;
    }
  };

  exitMenu = () => {
    console.log('leaving town');
    eventManager.publish('reset-user-input');
    eventManager.publish('hide-town');
  };

  public initTownInput() {
    return new UserInput({
      '32': this.accessMenuItem, // (space) access item
      '38': this.previousMenuItem, // up arrow key
      '40': this.nextMenuItem, // down arrow key
      '88': this.exitMenu, // e(x)it town
    });
  }
}
