class Status {
    constructor(EM) {
        EM.subscribe('character-moved', this.update, this)
        EM.subscribe('')
    }

    update(location) {
        this.set(location.description)
    }

    set(description, delay=0) {
        window.setTimeout(() => {
            document.getElementById('status').innerHTML = description
        }, delay)
    }
}


export default Status
