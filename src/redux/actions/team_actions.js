export function changeSportId(newID){
    return {type: "CHANGE_SPORT_ID", payload: {currentSportId: newID}}
}

export function setTeam(newTeam){
    return {type: "SET_TEAM", payload: {myTeam: newTeam}}
}

export function setGroup(newGroup){
    return {type: "SET_GROUP", payload: {myGroup: newGroup}}
}