import eventManager from './eventManager'

class Status {

    public EM: any

    constructor() {
        this.EM = eventManager
        this.EM.subscribe('character-moved', this.update, this)
        this.EM.subscribe('display-item', this.displayItem, this)
        this.EM.subscribe('status', this.default, this)
    }

    public update(location: any) {
        this.set(location.description)
    }

    public beginsWithVowel(text: any) {
        const firstLetter = text[0]
        const vowels = ['a', 'e', 'i', 'o', 'u']
        let beginsWithVowel = false
        vowels.forEach(vowel => {
            if (firstLetter === vowel) {
                beginsWithVowel = true
            }})
        return beginsWithVowel
    }

    public displayItem(itemName: any) {
        const beginsWithVowel = this.beginsWithVowel(itemName)
        let text = ''
        if (beginsWithVowel) {
            text = `you see an ${itemName} here`
        } else {
            text = `you see a ${itemName} here`
        }
        this.set(text, 10)
    }

    public default(text: any) {
        this.set(text, 10)
    }

    public set(description: any, delay=0) {
        window.setTimeout(() => {
            document.getElementById('status')!.innerHTML = description
        }, delay)
    }
}


export default Status
