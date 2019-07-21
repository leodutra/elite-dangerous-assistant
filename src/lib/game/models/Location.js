export default class Location {
    constructor (location) {
        this.name = location.name
        this.type = location.type
        this.system = location.system
        this.docked = location.docked
        this.cockpitBreach = location.cockpitBreach
        this.faction = location.faction
        this.factionState = location.factionState
        this.allegiance = location.allegiance
        this.economy = location.economy
        this.government = location.government
        this.security = location.security
        this.powers = location.powers
        this.powerplayState = location.powerplayState
    }
}
