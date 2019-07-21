module.exports = class Mission {
    constructor (mission) {
        this.id = mission.id
        this.name = mission.name
        this.offeringFaction = mission.offeringFaction
        this.commodity = mission.commodity
        this.targetName = mission.targetName
        this.targetType = mission.targetType
        this.targetFaction = mission.targetFaction
        this.expiryTime = mission.expiryTime
        this.destinationSystem = mission.destinationSystem
        this.destinationStation = mission.destinationStation
        this.passengerCount = mission.passengerCount
        this.passengerVIPs = mission.passengerVIPs
        this.passengerWanted = mission.passengerWanted
        this.passengerType = mission.passengerType
        this.reward = mission.reward
        this.donation = mission.donation
        this.permitsAwarded = mission.permitsAwarded
        this.commodityReward = mission.commodityReward
    }
}
