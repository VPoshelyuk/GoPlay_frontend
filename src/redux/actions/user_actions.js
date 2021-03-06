export function setUser(newUser){
    return {type: "SET_USER", payload: {user: newUser}}
}

export function setMyTeams(teams){
    return {type: "SET_TEAMS", payload: {teams: teams}}
}

export function setMyEvents(events){
    return {type: "SET_EVENTS", payload: {events: events}}
}

export function setAvailableEvents(av_events){
    return {type: "SET_AVAILABLE_EVENTS", payload: {av_events: av_events}}
}

export function setMyGroups(groups){
    return {type: "SET_GROUPS", payload: {groups: groups}}
}

export function addTeam(team){
    return {type: "ADD_TEAM", payload: {team: team}}
}

export function addGroup(group){
    return {type: "ADD_GROUP", payload: {group: group}}
}

export function addEvent(eToAdd){
    return {type: "ADD_EVENT", payload: {eToAdd: eToAdd}}
}
export function addAvailableEvent(aeToAdd){
    return {type: "ADD_AVAILABLE_EVENT", payload: {aeToAdd: aeToAdd}}
}

export function passEmailAndPass(newEmail, newPass){
    return {type: "PASS_EMAIL_AND_PASS", payload: {email: newEmail, password: newPass}}
}
