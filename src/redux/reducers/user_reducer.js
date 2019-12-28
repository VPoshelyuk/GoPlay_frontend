const defaultState = {
    currentUser: null,
    myTeams: null,
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
