import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import { setUser, setMyTeams } from './redux/actions/user_actions'


import NavBar from './NavBar'
import Home from './Home'
import LogIn from './LogIn'
import SignUp from './SignUp'
import LogOut from './LogOut'
import Profile from './Profile'
import Dashboard from './Dashboard'
import TeamSignUp from './TeamSignUp'
import TeamSearch from './TeamSearch'
import GroupsContainer from "./GroupsContainer"
import GroupInfo from "./GroupInfo"
import GroupSignUp from "./GroupSignUp"
import EventForm from "./EventForm"
import '../src/App.css'


class App extends React.Component {
  state = {
    loaded:false
  }
  componentDidMount(){
    const token = localStorage.token
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
          this.props.setUser(response)
          localStorage.token = response.token
          // fetch("http://localhost:3000/api/v1/my_teams", {
          //     method: "POST",
          //     headers: {
          //         "Content-Type": "application/json",
          //         "Accept": "application/json"
          //     },
          //     body: JSON.stringify({
          //         user_id: response.user.data.attributes.id
          //     })
          // })
          // .then(res => res.json())
          // .then(teams => {this.props.setMyTeams(teams.teams.data)})
          // .catch(() => this.props.setMyTeams(undefined))
        }
      })
    }
    setTimeout(() => {
      this.setState({
        loaded: true
      })
    }, 1000);
  }

  render() {
    return (
      <Fragment>
        {this.state.loaded?
          <Router>
            <div>
              <NavBar />
              <Route path="/logout">
                  <LogOut />
              </Route>
              <Route path="/login">
                  <LogIn />
              </Route>
              <Route path="/signup">
                  <SignUp />
              </Route>
              <Route path="/dashboard">
                  <Dashboard />
              </Route>
              <Route path="/groups">
                  <GroupsContainer add={0}/>
              </Route>
              <Route path="/add_group">
                  <GroupsContainer add={1}/>
              </Route>
              <Route path="/group/:id">
                  <GroupInfo/>
              </Route>
              <Route path="/create_group">
                  <GroupSignUp/>
              </Route>
              <Route path="/create_event">
                  <EventForm/>
              </Route>
              <Route path="/create_team">
                  <TeamSignUp />
              </Route>
              <Route path="/search_team">
                  <TeamSearch />
              </Route>
              <Route exact path="/profile">
                <Redirect to="/" />
              </Route>
              <Route exact path="/profile/@:username">
                  {this.props.currentUser !== null ?
                      <Profile 
                      />
                      :
                      <Redirect to="/" />
                    }
              </Route>
              <Route exact path="/">
              {this.props.currentUser === null ?
                      <Home />
                      :
                      <Redirect to="/dashboard" />
              }
              </Route>
            </div>
          </Router>
          :
          <div className="loading">
            <div className="lds-spinner"><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div></div>
          </div>
        }
      </Fragment>
    );
  }
}

function msp(state){
  return {
    currentUser: state.userReducer.currentUser
  }
}

export default connect(msp, { setUser, setMyTeams })(App)
