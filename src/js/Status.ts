import eventManager from './eventManager'

class Status {
    constructor() {
        this.EM = eventManager
        this.EM.subscribe('character-moved', this.update, this)
        this.EM.subscribe('display-item', this.displayItem, this)
        this.EM.subscribe('status', this.default, this)
    }

    update(location) {
        this.set(location.description)
    }

    beginsWithVowel(text) {
        const firstLetter = text[0]
        const vowels = ['a', 'e', 'i', 'o', 'u']
        let beginsWithVowel = false
        vowels.forEach(vowel => {
            if (firstLetter === vowel) {
                beginsWithVowel = true
            }})
        return beginsWithVowel
    }

    displayItem(itemName) {
        const beginsWithVowel = this.beginsWithVowel(itemName)
        let text = ''
        if (beginsWithVowel) {
            text = `you see an ${itemName} here`
        } else {
            text = `you see a ${itemName} here`
        }
        this.set(text, 10)
    }

    default(text) {
        this.set(text, 10)
    }

    set(description, delay=0) {
        window.setTimeout(() => {
            document.getElementById('status').innerHTML = description
        }, delay)
    }
}


export default Status
