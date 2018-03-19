class LandscapeData {
    constructor() {
        this.features = this.features()
        this.bare = this.bare()
    }

    features() {
        const period = {
            element: '.',
            description: 'the air is choked with dust, static, wifi',
            probability: 30,
            cls: 'period'
        }
        const comma = {
            element: ',',
            description: 'sprawl of smart homes, cul-de-sacs, laneways',
            probability: 30,
            cls: 'comma'
        }
        const semicolon = {
            element: ';',
            description: 'rows of greenhouses: some shattered and barren, others overgrown',
            probability: 15,
            cls: 'semicolon'
        }
        const grave = {
            element: '^',
            description: 'a shimmering field of solar panels, broken and corroded',
            probability: 15,
            cls: 'grave'
        }
        const asterisk = {
            element: '*',
            description: 'hollow users jack in at the datahubs',
            probability: 15,
            cls: 'asterisk'
        }
        return [period, comma, semicolon, semicolon, asterisk, asterisk, grave, grave]
    }

    bare() {
        const bare = {
            element: '&nbsp;',
            description: 'concrete and twisted rebar stretch to the horizon',
            cls: 'blank'
        }
        return bare
    }
}

export default LandscapeData
