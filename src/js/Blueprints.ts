import Utility from './Utility'


const blueprintData = {
    artificialMuscle: {
        abilities: '',
        description: '',
        name: 'artificial muscle (blueprint)',
        requirements: ''
    },
    prostheticArm: {
        abilities: '',
        description: '',
        name: 'prosthetic arm (blueprint)',
        requirements: ''
    },
    retinalDisplay: {
        abilities: '',
        description: '',
        name: 'retinal display (blueprint)',
        requirements: '',
    },
}


class Blueprint {

    public static random() {
        const blueprintValues = Object.values(blueprintData)
        const index = Utility.randomize(blueprintValues.length)

        const randomBlueprint = blueprintValues[index]

        return new Blueprint(randomBlueprint.name, randomBlueprint.description)
    }

    // type declaration
    
    public name: any
    public description: any

    constructor(name: any, description: any) {
        this.name = name
        this.description = description
    }


}


export default Blueprint

