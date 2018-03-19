import Utility from './Utility'


class UserInput {
    constructor(keyActionMap) {
        this.keyActionMap = keyActionMap

        document.onkeydown = this.tryActionForEvent.bind(this)
    }

    tryActionForEvent(event) {
        if (!Utility.contains(this.keyActionMap, event.keyCode)) {
            console.log(`not a valid keycode: ${event.keyCode}`)
        } else {
            this.keyActionMap[event.keyCode]()
        }
    }
}


export default UserInput
