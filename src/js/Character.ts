import { DIRECTIONS } from './Constants';
import eventManager from './eventManager';
import inventory from './inventory';
import { Map } from './Map';
import Moveable from './Moveable';
import { ILandscape } from './LandscapeData';

export interface IActor {
  name: string;
  type: string;
  element: string;
  cls: string;
  left: number;
  top: number;
  x: number;
  y: number;
}

export class Character extends Moveable {
  // Character data and actions
  public map: Map;
  public initialPosition: number[];
  public location: ILandscape;

  constructor(map: Map, initialPosition?: number[]) {
    super(map);

    this.map = map;
    if (initialPosition) {
      this.initialPosition = initialPosition;
    }

    this.initSettings();
    this.render();

    console.log('character rendered');
  }

  public initSettings() {
    this.setInitialGridIndices(this.getPosition());
  }

  public render() {
    this.updateSpan(this.getCharacter());
    this.drawLayer('character-layer');
  }

  public getPosition(): number[] {
    let position;
    this.initialPosition
      ? (position = this.initialPosition)
      : (position = this.map.getMapCenter());
    return position;
  }

  public getCharacter(): IActor {
    const { x, y } = this.getGridIndices();
    const { left, top } = this.getCSSCoordinates({ x, y });
    const character: IActor = {
      name: 'character',
      type: 'actor',
      element: '@',
      cls: 'character',
      left,
      top,
      x,
      y,
    };
    return character;
  }

  // try to do this with generics?
  // returns a bound function, based on the strings it receives
  // forcing fn to return void for now
  public getAction(fnName: string, arg?: string): () => void {
    return this[fnName].bind(this, arg);
  }

  public move(direction: string) {
    this.location = this.updateGridIndices(
      this.getCharacter(),
      DIRECTIONS[direction],
    );
    this.printLocalStatus();
    this.render();

    const position = {
      x: this.location.x,
      y: this.location.y,
    };

    eventManager.publish('moved-to', position);
  }

  public printLocalStatus() {
    eventManager.publish('character-moved', this.location);
    const localItem = this.getLocalItem();

    if (localItem) {
      if (localItem.mining === 'empty') {
        eventManager.publish(
          'status',
          'mining has been exhausted for this region',
        );
      } else if (localItem.mining) {
        eventManager.publish(
          'status',
          'a miner pulls compounds from the region',
        );
      } else {
        eventManager.publish('display-item', localItem.name);
      }
    }
  }

  public getLocalItem(): any {
    const char = this.getCharacter();
    let localItem = null;
    this.map.itemsOnMap.forEach((item: any) => {
      if (item.x === char.x && item.y === char.y) {
        localItem = item;
      }
    });
    return localItem;
  }

  public take() {
    const localItem = this.getLocalItem();

    if (localItem) {
      eventManager.publish(
        `${localItem.name}-${localItem.identityNumber} taken`,
      );
      eventManager.publish('status', `${localItem.name} taken`);
    } else {
      eventManager.publish('status', 'there is nothing here worth taking');
    }
  }

  public getItemLocation(itemName: any): any {
    const char = this.getCharacter();
    const itself = inventory.retrieveItem(itemName);
    const location = [char.x, char.y];
    return { itself, location };
  }

  public mine() {
    const miner = this.getItemLocation('particle miner');
    if (miner.itself) {
      miner.itself.mine(miner.location);
      eventManager.publish('remove-inventory', miner.itself);
    } else {
      eventManager.publish('status', 'you do not have any particle miners');
    }
  }
}
