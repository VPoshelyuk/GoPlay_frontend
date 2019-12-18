export function changeSportId(newID){
    return {type: "CHANGE_SPORT_ID", payload: {currentSportId: newID}}
}