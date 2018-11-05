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

    static random() {
        const blueprintValues = Object.values(blueprintData)
        const index = Utility.randomize(blueprintValues.length)

        const randomBlueprint = blueprintValues[index]

        return new Blueprint(randomBlueprint.name, randomBlueprint.description)
    }

    // type declaration
    
    name: any
    description: any

    constructor(name: any, description: any) {
        this.name = name
        this.description = description
    }


}


export default Blueprint

