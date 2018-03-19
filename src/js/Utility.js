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
}


export default Utility
