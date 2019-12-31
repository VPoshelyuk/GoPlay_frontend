const defaultState = {
    currentUser: null,
    myTeams: null,
    myEvents: null,
    availableEvents: null,
    myAdminGroups: null,
    email: "",
    password: ""
  }
  
  function userReducer(prevState = defaultState, action){
    switch(action.type){
      case "SET_USER":
        return {...prevState, currentUser: action.payload.user}
      case "SET_TEAMS":
        return {...prevState, myTeams: action.payload.teams}
      case "SET_GROUPS":
        return {...prevState, myAdminGroups: action.payload.groups}
      case "SET_EVENTS":
        return {...prevState, myEvents: action.payload.events}
      case "SET_AVAILABLE_EVENTS":
        return {...prevState, availableEvents: action.payload.av_events}
      case "ADD_TEAM":
        return {...prevState, myTeams: [...prevState.myTeams,action.payload.team]}
      case "ADD_GROUP":
        return {...prevState, myAdminGroups: [...prevState.myAdminGroups,action.payload.group]}
      case "PASS_EMAIL_AND_PASS":
        return {...prevState, 
              email: action.payload.email,
              password: action.payload.password
            }
      default:
        return prevState
    }
  
  }
  
  export default userReducer
