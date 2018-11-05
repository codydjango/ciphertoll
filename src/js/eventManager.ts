class EventManager {
    constructor() {
        this.eventsList = []        // create array of events
    }

    subscribe(event, fn, thisValue, once=false) {
        if (typeof thisValue === 'undefined') {   // if no thisValue provided, binds the fn to the fn??
            thisValue = fn
        }

        this.eventsList.push({      // create objects linking events + functions to perform
            event: event,           // push em to the array
            fn: fn,
            once: once,
            thisValue: thisValue
        })
    }

    // unsubscribe(event) {
    //     for (let i = 0; i < this.eventsList.length; i++) {
    //         if (this.eventsList[i].event === event) {
    //             this.eventsList.splice(i, 1)
    //             break
    //         }
    //     }
    // }

    publish(event, arg) {
        for (let i = 0; i < this.eventsList.length; i++) {
            if (this.eventsList[i].event === event) {
                const { thisValue, fn, once } = this.eventsList[i]
                fn.call(thisValue, arg)
                if (once) {
                    this.eventsList.splice(i, 1)
                }
            }
        }
    }

    getEventsList() {
        return this.eventsList
    }
}


export default new EventManager()
