const defaultState = {
  currentSportId: 0
  }
  
  function teamReducer(prevState = defaultState, action){
    switch(action.type){
      case "CHANGE_SPORT_ID":
        return {...prevState, currentSportId: action.payload.currentSportId}
      default:
        return prevState
    }
  
  }
  
  export default teamReducer