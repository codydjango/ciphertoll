/*
text data to do:

finish / edit down descriptions

create characters

populate locations w characters
assign lore to each char

create items and skills
populate locations with these


*/

interface ICharacter {
  name: string;
  description: string;
  lore: string[];
}

// interface IItem {
//   name: string;
// }

// interface ISkills {
//   name: string;
// }

export interface ILocation {
  name: string;
  description: string;
  characters: ICharacter[];
  items: any;
  skills: any;
}

const schemaBinders: ILocation = {
  name: `schema binders`,
  description: `goggled artisans craft and meld blueprint schema`,
  characters: [],
  items: [],
  skills: [],
};

const meltonHarflick: ILocation = {
  name: `melton-harflick corporate flagship`,
  description: `found here: corportate headquarters; anti-poisonware research; mass prosthetics division`,
  characters: [],
  items: [],
  skills: [],
};

const iconBranch: ILocation = {
  name: `intersect collider / oblique nexus`,
  description: `a decentro platform of bit scanners, shortwave cultivators, and interfacers`,
  characters: [],
  items: [],
  //         soft robotics

  skills: [],
};

const suadTemple: ILocation = {
  name: `SUAD temple`,
  description: `a major pilgrimage destination`,
  characters: [],
  items: [],
  skills: [],
  //     seeker of the codex
  //  hologram mystics
};

const spaceTether: ILocation = {
  name: `melton-harflick space tether`,
  description: `the glass spindle protrudes deep into the atmosphere`,
  characters: [],
  items: [],
  skills: [],
};

const tenements: ILocation = {
  name: `tenements`,
  description: `a ramshackle housing conglomorate`,
  characters: [],
  items: [],
  skills: [],
};

const compoundDebugAggregate: ILocation = {
  name: `compound debug aggregate`,
  description: `description not found`,
  characters: [],
  items: [],
  skills: [],
};

const precidio: ILocation = {
  name: `precidio`,
  description: `the local pseudomilitary franchise`,
  characters: [],
  items: [],
  skills: [],
};

const orchidHQ: ILocation = {
  name: `the orchid headquarters`,
  description: ``,
  characters: [],
  items: [],
  skills: [],
};

const extractorsUnion: ILocation = {
  name: `extractors' union`,
  description: `particle dust and gruff voices stir within`,
  characters: [],
  items: [],
  skills: [],
};

const gabezuTrust: ILocation = {
  name: `gabezu trust`,
  description: `this monolith houses the gabezu governmental offices`,
  characters: [],
  items: [],
  skills: [],
};

export interface ITown {
  name: string;
  kind: string;
  description: string;
  locations: ILocation[];
  // activities?: IActivity[];
}

const autonomousBuilding: ITown = {
  name: 'KF Hughes',
  kind: `autonomous building`,
  description: `the KF Hughes Autonomous Building stands overlooking sulphurous hills`,
  locations: [schemaBinders, tenements, precidio, extractorsUnion],
};

const sacredSite: ITown = {
  name: 'Ophelia',
  kind: `sacred site`, // Religious Enclosure (Pir, sacred site)
  description: `Ophelia's seventeen spires pierce the hazy firmament`,
  locations: [suadTemple, tenements],
};

const megacity: ITown = {
  name: 'Aves',
  kind: `megacity`,
  description: `Aves Megacity's crystal towers glimmer like lacquered data`,
  locations: [
    meltonHarflick,
    spaceTether,
    schemaBinders,
    tenements,
    precidio,
    extractorsUnion,
  ],
};

const arcology: ITown = {
  name: 'Talbott-Clark',
  kind: `arcology`,
  description: `vines seethe through the busted pavement surrounding Talbott-Clark Arco`,
  locations: [compoundDebugAggregate, iconBranch, precidio, tenements],
};

const terrapolis: ITown = {
  name: 'Barclay',
  kind: `terrapolis`,
  description: `the quivering webs of Barclay Habitat ebb into the distance`,
  locations: [orchidHQ, extractorsUnion, schemaBinders, tenements],
};

const metroplex: ITown = {
  name: 'Leander',
  kind: `metroplex`,
  description: `the glowing embers of Leander Metroplex illumine the horizon`,
  locations: [gabezuTrust, extractorsUnion, iconBranch, tenements, precidio],
};

export const TOWNS = [
  autonomousBuilding,
  sacredSite,
  megacity,
  arcology,
  terrapolis,
  metroplex,
];
