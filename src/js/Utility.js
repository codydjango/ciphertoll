let id = 0

function generateId() {
    id = id + 1
    return id
}

class Utility {
    static contains(obj, property) {
        return Object.keys(obj).indexOf(String(property)) !== -1
    }

    static stringToNumber(string) {
        return string.match(/\d+/)[0]
    }

    static randomize(mult) {
        return Math.floor(Math.random() * mult)
    }

    static Id() {
        return generateId()
    }

    static probability(percentage) {
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
