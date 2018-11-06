let id = 0

function generateId() {
    id = id + 1
    return id
}

class Utility {
    public static contains(obj: any, property: any) {
        return Object.keys(obj).indexOf(String(property)) !== -1
    }

    public static stringToNumber(str: any) {
        return str.match(/\d+/)[0]
    }

    public static randomize(mult: any) {
        return Math.floor(Math.random() * mult)
    }

    public static Id() {
        return generateId()
    }

    public static probability(percentage: any) {
        const probabilityArray = []
        for (let i = 0; i < percentage; i++) {
            probabilityArray.push(true)
        }
        for (let i = 0; i < 100 - percentage; i++) {
            probabilityArray.push(false)
        }
        return probabilityArray[Utility.randomize(100)]
    }
}


export default Utility
