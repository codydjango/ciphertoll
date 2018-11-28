import { ILandscape } from '../LandscapeData';
import { Map } from '../Map';
import Moveable from '../Moveable';
import Utility from '../Utility';

const townData: ILandscape = {
  element: 'X',
  description: '',
  probability: 0,
  cls: 'town',
  particleAmount: 0,
  maxParticles: 0,
  particles: {},
  walkable: true,
};

const names = [
  'Halliburton',
  'Quetzal',
  'Ophelia',
  'Miranda',
  'Barclay',
  'Leander',
];

const descriptions = [
  `you stumble into the town of XXX`,
  `the glowing embers of XXX illumine the horizon`,
  `the village of XXX stands overlooking the valley`,
  `twisted strands of rebar mark the site where XXX once stood`,
];

export class Town extends Moveable {
  public map: Map;
  public data: ILandscape;
  public x: number;
  public y: number;
  public name: string;

  constructor(map: Map) {
    super(map);

    this.map = map;
    this.setMap(map.landscape);

    this.generateTown();
    console.log(this.data.description); // descriptions different here

    this.placeTown();
  }

  placeTown() {
    this.setInitialPosition();

    this.x = this.initialPosition[0];
    this.y = this.initialPosition[1];
  }

  generateTown() {
    this.data = Object.assign({}, townData);
    this.name = this.getRandomTownName();
    this.data.description = this.getRandomDescription();
  }

  getRandomDescription() {
    const i = Utility.randomize(descriptions.length);

    const placeholderDescription = descriptions[i];

    descriptions.splice(i, 1);

    const description = placeholderDescription.replace('XXX', `${this.name}`);

    return description;
  }

  getRandomTownName() {
    const i = Utility.randomize(names.length);
    const name = names[i];
    names.splice(i, 1);

    return name;
  }
}
