import Utility from './Utility'


const blueprintData = {
    artificialMuscle: {
        name: 'artificial muscle (blueprint)',
        description: '',
        abilities: '',
        requirements: ''
    },
    retinalDisplay: {
        name: 'retinal display (blueprint)',
        description: '',
        abilities: '',
        requirements: ''
    },
    prostheticArm: {
        name: 'prosthetic arm (blueprint)',
        description: '',
        abilities: '',
        requirements: ''
    }
}


class Blueprint {
    constructor(name, description) {
        this.name = name
        this.description = description
    }

    static random() {
        const blueprintValues = Object.values(blueprintData)
        const index = Utility.randomize(blueprintValues.length)

        const randomBlueprint = blueprintValues[index]

        return new Blueprint(randomBlueprint.name, randomBlueprint.description)
    }
}


export default Blueprint

