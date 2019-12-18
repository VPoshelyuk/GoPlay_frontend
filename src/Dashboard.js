import React, {Fragment} from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeSportId } from './redux/actions/team_actions'

let my_team

class Dashboard extends React.Component{
    state = {
        createATeam: false,
        searchForATeam: false
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

    componentDidMount(){
        console.log(this.props)
        this.props.changeSportId(this.props.currentUser.user.data.attributes.activities[0].id)
    }

    render(){
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
        if(this.props.currentUser.user.data.attributes.teams.length !== 0){
            my_team = this.props.currentUser.user.data.attributes.teams.find(team => team.activity_id === this.props.sportId)
        }
        console.log(my_team)
        return (
            <Fragment>
                <form onChange={this.handleChange} className='form'>

                <p className='field' style={{right: "0" ,marginTop: "-20px", marginBottom: "10px", width: "100%"}}>
                    <select className='select' style={{textAlignLast: "center"}} defaultValue={this.props.currentUser.user.data.attributes.activities[0].id} name="location" id='select'>
                    <option value='' disabled>Choose Sport:</option>
                    {this.props.currentUser.user.data.attributes.activities.map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                    </select>
                </p> 
                </form>
                {this.props.currentUser.user.data.attributes.teams.length !== 0 && this.props.currentUser.user.data.attributes.teams.find(team => team.activity_id === this.props.sportId) !== undefined ?
                <div className="team_main">  
                    <h1 className="team_name">{my_team.name}</h1>
                    <h2 className="team_desc">{my_team.description}</h2>
                    <div className="logos_div">
                        <img className="team_logo" src={my_team.logo_path} />
                        <p className="team_location">{my_team.location}</p>
                        <img className="activity_logo" src={this.props.currentUser.user.data.attributes.activities.find(act => act.id === this.props.sportId).logo_path} />
                    </div>
                    <p className="team_mem_num">Number of members: {my_team.number_of_members}</p>
                    <div className="team_scores">
                        <p className="team_score">{my_team.won_games}</p>
                        <p className="team_score">{my_team.tie_games}</p>
                        <p className="team_score">{my_team.lost_games}</p>
                    </div>
                </div>
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
        );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp, { changeSportId })(Dashboard)