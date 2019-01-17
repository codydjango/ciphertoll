import Blueprints from './Blueprints';
import Blueprint from './Blueprints';
import { Character } from './Character';
import eventManager from './eventManager';
import inventory from './inventory';
import { Menus } from './InventoryDisplay';
import { generateItems } from './items';
import ParticleMiner from './items/ParticleMiner';
import { ILandscape } from './LandscapeData';
import { Map } from './Map';
import miningInventory from './miningInventory';
import Scenery from './Scenery';
import Status from './Status';
import { store } from './store';
import UserInput from './UserInput';
import { generateTowns } from './towns';

const COL = 80;
const ROW = 80;
const ITEM_NUM = 5;
const TOWN_NUM = 6;

export interface IMapSize {
  col: number;
  row: number;
}

interface ISettings {
  mapData: ILandscape[][];
}

export class Game {
  public blueprint: Blueprint;
  public items: ParticleMiner[];
  public settings: ISettings;
  public status: Status;
  public map: Map;
  public character: Character;

  public scenery: Scenery;
  public inventory: any;
  public miningInventory: any;
  public input: UserInput;
  public menus: Menus;

  public initGame() {
    if (this.hasGameInProgress()) {
      this.resumeSettings();
    } else {
      this.generateSettings();
    }

    const moved = (location: any) => {
      //   console.log('location', location);
    };
    eventManager.subscribe('moved-to', moved);

    this.loadSettings(this.settings);
    this.startGame();
  }

  public hasGameInProgress() {
    return store.has('map');
  }

  public resumeSettings() {
    this.settings = {
      mapData: store.get('map'),
    };
  }

  public generateSettings() {
    this.settings = {
      mapData: [],
    };

    const mapSize: IMapSize = { col: COL, row: ROW };
    this.settings.mapData = Map.generate(mapSize);

    store.set('map', this.settings.mapData);
  }

  // started typing here

  public loadSettings(settings: ISettings) {
    this.status = new Status();
    this.menus = new Menus();

    const map = (this.map = new Map(settings.mapData));

    const towns = generateTowns(TOWN_NUM, map);
    map.setTowns(towns);

    this.scenery = new Scenery(map);
    const character = (this.character = new Character(map));

    const blueprint = (this.blueprint = Blueprints.random());
    const items = (this.items = generateItems(ITEM_NUM, map));

    map.setItems(items);
    map.setCharacter(character);

    this.inventory = inventory;
    this.inventory.add(blueprint);
    this.miningInventory = miningInventory;

    this.input = this.initUserInput(character);
    eventManager.subscribe('reset-user-input', this.resetUserInput, this);
  }

  public reset() {
    console.log('reset game!');

    eventManager.publish('reset');

    this.initGame();
  }

  public resetUserInput() {
    const character = this.character;
    this.input = this.initUserInput(character);
  }

  public initUserInput(character: Character) {
    return new UserInput({
      '78': this.reset.bind(this), // (n) new map
      '38': character.getAction('move', 'north'),
      '37': character.getAction('move', 'west'),
      '39': character.getAction('move', 'east'),
      '40': character.getAction('move', 'south'),
      '84': character.getAction('take'), // (t)ake item
      '77': character.getAction('mine'), // deploy particle (m)iner
      '69': character.getAction('enter'), // (e)nter town
      //   '88': character.getAction('exit'), // e(x)it town -- exit lives on menu input
    });
  }

  public startGame() {
    this.status.set('you wake up');
    this.status.set(`you are carrying ${this.blueprint.name}`, 4000);
  }
}
