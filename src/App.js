import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import NavBar from './NavBar'
import Home from './Home'
import LogIn from './LogIn'
import SignUp from './SignUp'
import LogOut from './LogOut'
import Profile from './Profile'
import '../src/App.css'


export default class App extends React.Component {
  state = {
    currentUser: null,

    loaded: false,

    showEvent: {},

    allNearestEvents: [],
    allChoosenAreaEvents: [],
    allFreeEvents: [],
    allRandEvents: [],
    showEvents: [],

    myEvents: [],
    myLat: 0,
    myLong: 0
  }

  componentDidMount(){
    const token = localStorage.token
    this.setState({
      loaded: true
    })
    if(token){
      fetch("http://localhost:3000/api/v1/auto_login", {
        headers: {
          "authorization": token
        }
      })
      .then(res => res.json())
      .then(response =>{
        if (response.errors){
          alert(response.errors)
        } else {
          this.setState({
            currentUser: response
          })
        }
      })
    }
  }

  setUser = (response) => {
    this.setState({
      currentUser: response.user
    }, () => {
      localStorage.token = response.token
    })
  }

  logout = () => {
    this.setState({
      currentUser: null
    }, () => {
      localStorage.removeItem("token")
    })
  }

  // render(){
  //   return (
  //     <div>
  //       {
  //         this.state.loaded ?
  //           <NavBar 
  //             currentUser={this.state.currentUser} 
  //             setUser={this.setUser} 
  //             logout={this.logout} 
  //             chosenEvent={this.state.showEvent} 
  //             chooseEvent={this.chooseEvent} 
  //             setAllNearesEvents={this.setAllNearesEvents}
  //             setAllChoosenEvents={this.setAllChoosenEvents}
  //             setAllFreeEvents={this.setAllFreeEvents}
  //             setAllRandEvents={this.setAllRandEvents}
  //             setMyCoords={this.setMyCoords}
  //             showEvents={this.state.showEvents}
  //             setContainerId={this.setContainerId}
  //             setMyEvents={this.setMyEvents}
  //             removeEvent={this.removeEvent}
  //             addEvent={this.addEvent}
  //             myEvents={this.state.myEvents}
  //             myLat={this.state.myLat}
  //             myLong={this.state.myLong}
  //           />
  //         :
  //           <h1 style={{textAlign: "center"}}>Loading...</h1>
  //       }
  //     </div>
  //   );
  // }


  render() {
    return (
      <Router>
        <div>
          <NavBar currentUser={this.state.currentUser} />
          <Route exact path="/">
              <Home />
          </Route>
          <Route path="/logout">
              <LogOut logout={this.logout}/>
          </Route>
          <Route path="/login">
              <LogIn setUser={this.setUser} currentUser={this.state.currentUser} />
          </Route>
          <Route path="/signup">
              <SignUp setUser={this.setUser} currentUser={this.state.currentUser} />
          </Route>
          <Route path="/profile">
              {this.currentUser !== null ?
                  <Profile 
                      currentUser={this.state.currentUser} 
                      setUser={this.setUser} 
                      logout={this.logout}
                  />
                  :
                  <Redirect to="/" />
              }
          </Route>
        </div>
      </Router>
    );
  }
}
