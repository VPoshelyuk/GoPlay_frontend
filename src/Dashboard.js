import React, {Fragment} from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeSportId, setTeam, setGroup } from './redux/actions/team_actions'
import { setMyTeams, setAvailableEvents, setMyEvents } from './redux/actions/user_actions'
import GroupCard from './GroupCard';
import EventCard from './EventCard';

class Dashboard extends React.Component{
    state = {
        createATeam: false,
        searchForATeam: false,
        joinGroup: false,
        loaded: false
    }

    handleCreateTeam = () => {
        this.setState({
            createATeam: true
        })
    }

    handleSearchTeam = () => {
        this.setState({
            searchForATeam: true
        })
    }

    handleChange = (e) => {
        this.props.changeSportId(parseInt(e.target.value))
    }

    handleJoinGroup = () => {
        this.setState({
            joinGroup: true
        })
    }

    componentDidMount(){
        console.log(Date.now())
        console.log(this.props)
        this.props.setGroup(undefined)
        fetch("http://localhost:3000/api/v1/my_teams", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              },
              body: JSON.stringify({
                  user_id: this.props.currentUser.user.data.attributes.id
              })
          })
          .then(res => res.json())
        //   .catch(() => this.props.setMyTeams(undefined))
          .then(teams => {
              this.props.setMyTeams(teams.teams.data)
              this.props.setTeam(this.props.myTeams? this.props.myTeams.find(team => team.attributes.activity_id === this.props.sportId):undefined)
                console.log(this.props)
                setTimeout(() => {
                    if (this.props.myTeam !== undefined && this.props.myTeam !== null) {
                        let group_ids = []
                        group_ids += this.props.myTeam.attributes.groups.map(group => group.id)
                        console.log(group_ids, "bitch")
                        const fD = new FormData()
                        fD.append("groups_id", group_ids)
                        fD.append("user_id", this.props.currentUser.user.data.attributes.id)
                        fetch("http://localhost:3000/api/v1/my_events", {
                        method: "POST",
                        body: fD
                        })
                        .then(res => res.json())
                        .then(events => {
                            this.props.setMyEvents(events.events.data)
                            fetch("http://localhost:3000/api/v1/available_events", {
                            method: "POST",
                            body: fD
                            })
                            .then(res => res.json())
                            .then(events => {
                                this.props.setAvailableEvents(events.events.data)
                                this.setState({
                                    loaded: true
                                })
                            })
                        })
                    } else {
                        this.setState({
                            loaded: true
                        })
                    }
                }, 1);
          })
        this.props.changeSportId(this.props.currentUser.user.data.attributes.activities[0].id)
    }

    componentDidUpdate(prevProps){
        if(this.props.myTeams !== undefined && this.props.sportId !== prevProps.sportId && prevProps.sportId !== 0){
            this.setState({
                loaded: false
            })
            this.props.setTeam(this.props.myTeams? this.props.myTeams.find(team => team.attributes.activity_id === this.props.sportId):undefined)
            console.log(this.props)
            setTimeout(() => {
                if (this.props.myTeam !== undefined && this.props.myTeam !== null) {
                    let group_ids = []
                    group_ids += this.props.myTeam.attributes.groups.map(group => group.id)
                    const fD = new FormData()
                    fD.append("groups_id", group_ids)
                    fD.append("user_id", this.props.currentUser.user.data.attributes.id)
                    fetch("http://localhost:3000/api/v1/my_events", {
                        method: "POST",
                        body: fD
                    })
                    .then(res => res.json())
                    .then(events => {
                        this.props.setMyEvents(events.events.data)
                        fetch("http://localhost:3000/api/v1/available_events", {
                        method: "POST",
                        body: fD
                        })
                        .then(res => res.json())
                        .then(events => {
                            this.props.setAvailableEvents(events.events.data)
                            this.setState({
                                loaded: true
                            })
                        })
                    })
                } else {
                    this.setState({
                        loaded: true
                    })
                }
            }, 1);
        }
    }

    //componentDidUpdate instead of my_team

    render(){
        console.log(this.props, this.state)
        if(this.state.createATeam){
            this.setState({
                createATeam: false
            })
            return <Redirect to="/create_team" />
        }
        if(this.state.searchForATeam){
            this.setState({
                searchForATeam: false
            })
            return <Redirect to="/search_team" />
        }
        if(this.state.joinGroup){
            this.setState({
                joinGroup: false
            })
            return <Redirect to="/add_group" />
        }
        // if(this.props.currentUser.user.data.attributes.teams.length !== 0){
        //     my_team = this.props.currentUser.user.data.attributes.teams.find(team => team.activity_id === this.props.sportId)
        // }

        return (
            <Fragment>
                <form onChange={this.handleChange} className='form'>

                <p className='field' style={{right: "0" ,marginTop: "-20px", marginBottom: "10px", width: "100%"}}>
                    <select className='select' style={{textAlignLast: "center"}} defaultValue={this.props.currentUser.user.data.attributes.activities.sort((a, b) => a.id - b.id)[0].id} name="location" id='select'>
                    <option value='' disabled>Choose Sport:</option>
                    {this.props.currentUser.user.data.attributes.activities.sort((a, b) => a.id - b.id).map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                    </select>
                </p> 
                </form>
                <Fragment>
                    {
                        this.props.myTeam !== undefined && this.props.myTeam !== null?
                        <Fragment>
                            {this.state.loaded ?
                            <div className="team_main">  
                                <h1 className="team_name">{this.props.myTeam.attributes.name}</h1>
                                <h2 className="team_desc">{this.props.myTeam.attributes.description}</h2>
                                <div className="logos_div">
                                    <img className="team_logo" src={this.props.myTeam.attributes.logo} alt="sport_logo" />
                                    <p className="team_location">{this.props.myTeam.attributes.location}</p>
                                    <img className="activity_logo" src={this.props.currentUser.user.data.attributes.activities.find(act => act.id === this.props.sportId).logo_path} alt="sport_logo_path" />
                                </div>
                                <p className="team_mem_num">Number of members: {this.props.myTeam.attributes.number_of_members}</p>
                                <div className="team_scores">
                                    <p className="team_score">{this.props.myTeam.attributes.won_games}</p>
                                    <p className="team_score">{this.props.myTeam.attributes.tie_games}</p>
                                    <p className="team_score">{this.props.myTeam.attributes.lost_games}</p>
                                </div>
                                {this.props.myTeam.attributes.admin.id === this.props.currentUser.user.data.attributes.id ?
                                <button onClick={this.handleJoinGroup} style={{marginTop: "200px"}} className='dash_button'>Join Group</button>
                                :
                                null
                                }
                                {this.props.currentUser.user.data.attributes.events.map(event => <EventCard key={event.id} event={event} status_check={1} />)}
                                <h1>Your events sucker:</h1>
                                {this.props.availableEvents.map(event => <EventCard key={event.attributes.id} event={event.attributes} />)}
                                <h1>Your groups sucker:</h1>
                                {this.props.myTeam.attributes.groups.map(group => <GroupCard key={group.id} group={group} add={0} />)}
                            </div>
                            :
                            <div className="loading">
                                <div className="lds-spinner"><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div></div>
                            </div>
                            }
                        </Fragment>
                        :
                        <div className="dash_main">  
                            <h3 className="main_text">You are not currently</h3>
                            <h3 className="main_text">a member of any team</h3>
                            <h3 className="main_text">but we got you, you can:</h3><br/><br/>
                            <button onClick={this.handleCreateTeam} className='dash_button'>Create a team</button>
                            <button onClick={this.handleSearchTeam} className='dash_button'>Search for a team to join</button>
                        </div>
                    }
                </Fragment>
            </Fragment>
        );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        sportId: state.teamReducer.currentSportId,
        availableEvents: state.userReducer.availableEvents,
        myEvents: state.userReducer.myEvents,
        myTeam: state.teamReducer.currentTeam,
        // myGroups: state.teamReducer.currentGroups,
        myTeams: state.userReducer.myTeams
    }
}

export default connect(msp, { changeSportId, setTeam, setMyTeams, setGroup, setAvailableEvents, setMyEvents })(Dashboard)