import Utility from "./Utility";

const blueprintData = {
    artificialMuscle: {
        abilities: "",
        description: "",
        name: "artificial muscle (blueprint)",
        requirements: ""
    },
    prostheticArm: {
        abilities: "",
        description: "",
        name: "prosthetic arm (blueprint)",
        requirements: ""
    },
    retinalDisplay: {
        abilities: "",
        description: "",
        name: "retinal display (blueprint)",
        requirements: ""
    }
};

interface IBlueprint {
    name: string;
    description: string;
    abilities: string;
    requirements: string;
}

class Blueprint {
    public static random() {
        const blueprintValues = Object.values(blueprintData);
        const index = Utility.randomize(blueprintValues.length);

        const randomBlueprint = blueprintValues[index];

        return new Blueprint(randomBlueprint);
    }

    // type declaration

    public name: string;
    public description: string;
    public abilities: string;
    public requirements: string;

    constructor(blueprint: IBlueprint) {
        const { name, description, abilities, requirements } = blueprint;
        this.name = name;
        this.description = description;
        this.abilities = abilities;
        this.requirements = requirements;
    }
}

export default Blueprint;
