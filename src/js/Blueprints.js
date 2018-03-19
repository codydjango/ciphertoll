import Utility from './Utility'


const blueprintData = {
    artificialMuscle: {
        name: 'Artificial Muscle',
        description: '',
        abilities: '',
        requirements: ''
    },
    retinalDisplay: {
        name: 'Retinal Display',
        description: '',
        abilities: '',
        requirements: ''
    },
    prostheticArm: {
        name: 'Prosthetic Arm',
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

