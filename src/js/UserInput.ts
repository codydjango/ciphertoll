import Utility from './Utility'


class UserInput {

    public keyActionMap: any
    
    constructor(keyActionMap: any) {
        this.keyActionMap = keyActionMap

        document.onkeydown = this.tryActionForEvent.bind(this)
    }

    public tryActionForEvent(event: any) {
        if (!Utility.contains(this.keyActionMap, event.keyCode)) {
            console.log(`not a valid keycode: ${event.keyCode}`)
        } else {
            this.keyActionMap[event.keyCode]()
        }
    }
}


export default UserInput
