const defaultState = {
  currentSportId: 0,
  currentTeam: null,
  currentGroup: null
  }
  
  function teamReducer(prevState = defaultState, action){
    switch(action.type){
      case "CHANGE_SPORT_ID":
        return {...prevState, currentSportId: action.payload.currentSportId}
      case "SET_TEAM":
          return {...prevState, currentTeam: action.payload.currentTeam}
      case "SET_GROUP":
        return {...prevState, currentGroup: action.payload.currentGroup}
      default:
        return prevState
    }
  
  }
  
  export default teamReducer