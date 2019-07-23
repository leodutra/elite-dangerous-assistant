import Location from './models/Location'
import Material from './models/Material'
import Mission from './models/Mission'

export default class GameEventSink {
    constructor (store, gameEventStream) {
        this.store = store
        this.gameEventStream = gameEventStream
        this.gameEventStream.on('data', data => {
            switch (data.event) {
            case 'ApproachSettlement':
                store.commit('setApproachedSettlement', data.Name)
                break
            case 'BuyTradeData':
                subtractCredits(store, data.Cost)
                break
            case 'Docked':
                store.commit('setShipIsDocked', true)
                break
            case 'FSDJump':
                store.commit('setShipJumpedDistance', data.JumpDist)
                store.commit('setShipFuelUsed', data.FuelUsed)
                store.commit('setShipFuelLevel', data.FuelLevel)
                store.commit('setShipJumpBoostUsed', data.BoostUsed)
                store.commit('setCurrentLocation', new Location({
                    name: data.StationName || data.Body,
                    type: data.StationType || data.BodyType,
                    system: data.StarSystem,
                    docked: data.Docked,
                    faction: data.Faction,
                    factionState: data.FactionState,
                    allegiance: data.Allegiance,
                    economy: data.Economy,
                    government: data.Government,
                    security: data.Security,
                    powers: data.Powers,
                    powerplayState: data.PowerplayState
                }))
                break
            case 'LoadGame':
                store.commit('setCommanderName', data.Commander)
                store.commit('setShipId', data.ShipID)
                store.commit('setShipType', data.Ship)
                store.commit('setGameMode', data.GameMode)
                store.commit('setCommanderCredits', data.Credits)
                store.commit('setCommanderLoan', data.Loan)
                break
            case 'Location':
                store.commit('setCurrentLocation', new Location({
                    name: data.StationName || data.Body,
                    type: data.StationType || data.BodyType,
                    system: data.StarSystem,
                    docked: data.Docked,
                    faction: data.Faction,
                    factionState: data.FactionState,
                    allegiance: data.Allegiance,
                    economy: data.Economy,
                    government: data.Government,
                    security: data.Security,
                    powers: data.Powers,
                    powerplayState: data.PowerplayState
                }))
                break
            case 'MarketBuy':
                // TODO enhance MarketBuy event
                subtractCredits(store, data.TotalCost)
                break
            case 'MarketSell':
                // TODO enhance MarketSell event
                addCredits(store, data.TotalSale)
                break
            case 'MaterialCollected':
                addMaterial(store, new Material({
                    name: data.Name,
                    category: data.Category,
                    count: data.Count
                }))
                break
            case 'MaterialDiscarded':
                subtractMaterial(store, new Material({
                    name: data.Name,
                    category: data.Category,
                    count: data.Count
                }))
                break
            case 'MissionAbandoned':
                abandonMission(store, data.MissionID)
                break
            case 'MissionAccepted':
                acceptMission(store, new Mission({
                    id: data.MissionID,
                    name: data.Name,
                    offeringFaction: data.Faction,
                    commodity: data.Commodity,
                    targetName: data.Target,
                    targetType: data.TargetType,
                    targetFaction: data.TargetFaction,
                    expiryTime: data.Expiry,
                    destinationSystem: data.DestinationSystem,
                    destinationStation: data.DestinationStation,
                    passengerCount: data.PassengerCount,
                    passengerVIPs: data.PassengerVIPs,
                    passengerWanted: data.PassengerWanted,
                    passengerType: data.PassengerType,
                    reward: data.Reward,
                    donation: data.Donation,
                    permitsAwarded: data.PermitsAwarded,
                    commodityReward: data.CommodityReward
                }))
                break
            case 'MissionCompleted':
                completeMission(store, new Mission({
                    id: data.MissionID,
                    name: data.Name,
                    offeringFaction: data.Faction,
                    commodity: data.Commodity,
                    targetName: data.Target,
                    targetType: data.TargetType,
                    targetFaction: data.TargetFaction,
                    expiryTime: data.Expiry,
                    destinationSystem: data.DestinationSystem,
                    destinationStation: data.DestinationStation,
                    passengerCount: data.PassengerCount,
                    passengerVIPs: data.PassengerVIPs,
                    passengerWanted: data.PassengerWanted,
                    passengerType: data.PassengerType,
                    reward: data.Reward,
                    donation: data.Donation,
                    permitsAwarded: data.PermitsAwarded,
                    commodityReward: data.CommodityReward
                }))
                break
            case 'MissionFailed':
                abandonMission(store, data.MissionID)
                break
            case 'ModuleBuy':
                // TODO enhance ModuleBuy event
                subtractCredits(store, data.BuyPrice - (data.SellPrice || 0))
                break
            case 'ModuleRetrieve':
                // TODO enhance ModuleRetrieve event
                subtractCredits(store, data.Cost)
                break
            case 'ModuleSell':
                // TODO enhance ModuleSell event
                addCredits(store, data.SellPrice)
                break
            case 'ModuleSellRemote':
                // TODO enhance ModuleSellRemote event
                addCredits(store, data.SellPrice)
                break
            case 'ModuleStore':
                // TODO enhance ModuleStore event
                subtractCredits(store, data.Cost)
                break
            case 'PayFines':
            case 'PayLegacyFines':
                subtractCredits(store, data.Amount)
                break
            case 'RedeemVoucher':
                addCredits(store, data.Amount)
                break
            case 'RefuelAll':
            case 'RefuelPartial':
            case 'Repair':
            case 'RepairAll':
            case 'RestockVehicle':
                subtractCredits(store, data.Cost)
                break
            case 'SellDrones':
                addCredits(store, data.TotalSale)
                break
            case 'ShipyardBuy':
                subtractCredits(store, data.ShipPrice - (data.SellPrice || 0))
                break
            case 'ShipyardSell':
                addCredits(store, data.ShipPrice)
                break
            case 'ShipyardTransfer':
                subtractCredits(store, data.TransferPrice)
                break
            case 'Progress':
                // TODO Progress event
                break
            case 'Rank':
                // TODO Rank event
                break
            case 'Scan':
                // TODO Scan event
                break
            case 'SupercruiseEntry':
                store.commit('setShipIsSupercruising', true)
                break
            case 'SupercruiseExit':
                store.commit('setShipIsSupercruising', false)
                store.commit('setCurrentLocation', new Location({
                    name: data.Body,
                    type: data.BodyType,
                    system: data.StarSystem
                }))
                break
            case 'Undocked':
                store.commit('setShipIsDocked', false)
                break
            }
        })
        this.gameEventStream.on('end', data => {
            console.log('GameEventSink (on stream end):', data)
        })
        this.gameEventStream.on('error', error => {
            console.error('GameEventSink (on stream error):', error)
        })
    }
}

function addMaterial (store, material) {
    const storedMaterials = store.state.commanderMaterials
    if (storedMaterials[material.name]) {
        material.count += storedMaterials[material.name].count
    }
    store.commit('setCommanderMaterials', {
        ...storedMaterials,
        [material.name]: material
    })
}

function subtractMaterial (store, material) {
    const storedMaterials = store.state.commanderMaterials
    if (storedMaterials[material.name]) {
        material.count = storedMaterials[material.name].count - material.count
        store.commit('setCommanderMaterials', {
            ...storedMaterials,
            [material.name]: material
        })
    }
}

function abandonMission (store, missionId) {
    const storedMissions = store.state.commanderMissions
    if (storedMissions[missionId]) {
        const newState = { ...storedMissions }
        delete newState[missionId]
        store.commit('setCommanderMissions', newState)
    }
}

function acceptMission (store, mission) {
    const storedMissions = store.state.commanderMissions
    if (storedMissions[mission.id]) {
        throw new Error('Trying to accept existing mission ID')
    }
    store.commit('setCommanderMissions', {
        ...storedMissions,
        [mission.id]: mission
    })
}

function completeMission (store, mission) {
    // TODO enhance mission complete commodity reward and others
    const storedMissions = store.state.commanderMissions
    if (storedMissions[mission.Id]) {
        const newState = { ...storedMissions }
        delete newState[mission.Id]
        store.commit('setCommanderMissions', newState)
    }
    addCredits(store, mission.Reward)
}

function addCredits (store, credits) {
    store.commit(
        'setCommanderCredits',
        store.state.commanderCredits + (credits || 0)
    )
}

function subtractCredits (store, credits) {
    store.commit(
        'setCommanderCredits',
        store.state.commanderCredits - (credits || 0)
    )
}
