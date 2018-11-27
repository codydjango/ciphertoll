import Utility from '../Utility';
// import Item from './Item'
import ParticleMiner from './ParticleMiner';
import { Map } from '../Map';

const ITEMS = [ParticleMiner];

function randomItem(map: Map) {
  return new ITEMS[(Utility.randomize(ITEMS.length))](map);
}

const generateItems = (num = 1, map: Map) => {
  const items: ParticleMiner[] = [];
  for (let i = 0; i < num; i++) {
    items.push(randomItem(map));
  }
  return items;
};

export { generateItems };
