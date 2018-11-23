export interface ILandscape {
  element: string;
  description: string;
  probability?: number;
  cls: string;
  particleAmount: number;
  maxParticles: number;
  particles: ILandscapeParticles;
  x?: number;
  y?: number;
  left?: number;
  top?: number;
}

export interface ILandscapeParticles {
  iron?: number;
  copper?: number;
  chrome?: number;
  lead?: number;
  mercury?: number;
  styrofoam?: number;
  acrylic?: number;
  bone?: number;
  hydrocarbons?: number;
  uranium?: number;
  carbon?: number;
  silicon?: number;
  benzene?: number;
  glass?: number;
  fiber?: number;
  ceramic?: number;
  latex?: number;
  wood?: number;
  ozone?: number;
}

const features: ILandscape[] = [
  {
    element: '.',
    description: 'the air is choked with dust, static, wifi',
    probability: 25,
    cls: 'period',
    particles: {
      copper: 10,
      chrome: 15,
      lead: 30,
      styrofoam: 30,
      acrylic: 20,
      hydrocarbons: 15,
      silicon: 10,
      ceramic: 10,
    },
    particleAmount: 10,
    maxParticles: 10,
  },
  {
    element: ',',
    description: 'sprawl of smart homes, cul-de-sacs, laneways',
    probability: 26,
    cls: 'comma',
    particles: {
      iron: 30,
      copper: 10,
      mercury: 10,
      latex: 15,
      wood: 20,
      hydrocarbons: 15,
      glass: 30,
      carbon: 20,
    },
    particleAmount: 10,
    maxParticles: 10,
  },
  {
    element: ';',
    description:
      'rows of greenhouses: some shattered and barren, others overgrown',
    probability: 24,
    cls: 'semicolon',
    particles: {
      iron: 30,
      wood: 20,
      fiber: 10,
      bone: 10,
      acrylic: 20,
      ozone: 15,
      glass: 30,
      carbon: 20,
    },
    particleAmount: 10,
    maxParticles: 10,
  },
  {
    element: '^',
    description: 'a shimmering field of solar panels, broken and corroded',
    probability: 22,
    cls: 'grave',
    particles: {
      copper: 10,
      mercury: 10,
      acrylic: 20,
      fiber: 10,
      ozone: 15,
      benzene: 20,
      glass: 30,
      ceramic: 10,
    },
    particleAmount: 10,
    maxParticles: 10,
  },
  {
    element: '*',
    description: 'hollow users jack in at the datahubs',
    probability: 20,
    cls: 'asterisk',
    particles: {
      chrome: 15,
      lead: 30,
      mercury: 10,
      styrofoam: 30,
      acrylic: 20,
      benzene: 20,
      silicon: 10,
      carbon: 20,
    },
    particleAmount: 10,
    maxParticles: 10,
  },
];

const bare: ILandscape = {
  element: '&nbsp;',
  description: 'concrete and twisted rebar stretch to the horizon',
  cls: 'blank',
  particleAmount: 10,
  maxParticles: 10,
  particles: {
    iron: 30,
    copper: 10,
    chrome: 15,
    lead: 30,
    mercury: 10,
    styrofoam: 30,
    bone: 10,
    hydrocarbons: 15,
    uranium: 10,
    carbon: 20,
  },
};

export { features, bare };
