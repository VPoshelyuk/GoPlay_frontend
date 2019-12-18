const defaultState = {
    currentUser: null,
    email: "",
    password: ""
  }
  
  function userReducer(prevState = defaultState, action){
    switch(action.type){
      case "SET_USER":
        return {...prevState, currentUser: action.payload.user}
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
