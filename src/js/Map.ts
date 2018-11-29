import { Character } from './Character';
import { IMapSize } from './game';
import { ILandscape } from './LandscapeData';
import MapGenerator from './MapGenerator';
import Utility from './Utility';
import Item from './items/Item';
import { Town } from './towns/Town';

export class Map {
  public static getCol(mapData: ILandscape[][]) {
    return mapData.length;
  }

  public static getRow(mapData: ILandscape[][]) {
    return mapData[0].length;
  }

  public static generate({ col, row }: IMapSize) {
    const mapGenerator = new MapGenerator();

    return mapGenerator.generate({ col, row });
  }

  public landscape: ILandscape[][];
  public col: number;
  public row: number;
  public itemsOnMap: any[];
  public character: Character;

  constructor(mapData: ILandscape[][]) {
    // console.log('map constructor', mapData)

    this.landscape = mapData;
    this.col = Map.getCol(mapData);
    this.row = Map.getRow(mapData);

    this.itemsOnMap = [];
  }

  public getMap() {
    return this.landscape;
  }

  public getMapCenter(): number[] {
    return [Math.floor(this.col / 2), Math.floor(this.row / 2)];
  }

  public getRandomMapLocation() {
    return [Utility.randomize(this.row - 1), Utility.randomize(this.col - 1)];
  }

  public setCharacter(character: Character) {
    this.character = character;
    this.character.setMap(this.landscape);
  }

  /////////////////

  public setItems(items: Item[]) {
    items.map((item: Item) => {
      //   const randomMapLocation = this.getRandomMapLocation();
      item.setMap(this.landscape);
      item.setInitialPosition();
      item.setOnMap(item.initialPosition);
      item.createInitialChildElement('item-layer'); // moved childElement creation out of 'setOnMap'
      this.pushItem(item);
    });
  }

  public pushItem(item: any) {
    this.itemsOnMap.push(item);
  }

  public setTowns(towns: Town[]) {
    towns.forEach(town => {
      this.landscape[town.y][town.x] = town.mapInfo;
    });
  }
}
