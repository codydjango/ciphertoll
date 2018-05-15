import Utility from './Utility'


const blueprintData = {
    artificialMuscle: {
        name: 'artificial muscle (blueprint)',
        type: 'blueprint',
        description: '',
        abilities: '',
        requirements: {
            synthetics: 70,
            organics: 20,
            silicon: 10
        }
    },
    retinalDisplay: {
        name: 'retinal display (blueprint)',
        type: 'blueprint',
        description: '',
        abilities: '',
        requirements: {
            metals: 20,
            synthetics: 20,
            organics: 10,
            glass: 30,
            silicon: 20
        }
    },
    prostheticArm: {
        name: 'prosthetic arm (blueprint)',
        type: 'blueprint',
        description: '',
        abilities: '',
        requirements: {
            metals: 80,
            synthetics: 10,
            uranium: 10
        }
    }
}


class Blueprint {
    constructor(randomBlueprint) {
        this.name = randomBlueprint.name
        this.type = randomBlueprint.type
        this.description = randomBlueprint.description
        this.abilities = randomBlueprint.abilities
        this.requirements = randomBlueprint.requirements
    }

    static random() {
        const blueprintValues = Object.values(blueprintData)
        const index = Utility.randomize(blueprintValues.length)

        const randomBlueprint = blueprintValues[index]

        return new Blueprint(randomBlueprint)
    }
}


export default Blueprint

