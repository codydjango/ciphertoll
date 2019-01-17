// import Utility from '../Utility';
import { Map } from '../Map';
import { Town } from './Town';

// const TOWNS = [Town];

// function randomTown(map: Map) {
//   return new TOWNS[(Utility.randomize(TOWNS.length))](map);
// }

const generateTowns = (num = 1, map: Map) => {
  const towns: Town[] = [];
  for (let i = 0; i < num; i++) {
    towns.push(new Town(map));
  }
  return towns;
};

export { generateTowns };
