const defaultState = {
  currentSportId: 0,
  myTeam: null,
  myGroup: null
  }
  
  function teamReducer(prevState = defaultState, action){
    switch(action.type){
      case "CHANGE_SPORT_ID":
        return {...prevState, currentSportId: action.payload.currentSportId}
      case "SET_TEAM":
          return {...prevState, myTeam: action.payload.myTeam}
      case "SET_GROUP":
        return {...prevState, myGroup: action.payload.myGroup}
      default:
        return prevState
    }
  
  }
  
  export default teamReducer