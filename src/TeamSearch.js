import React, {Fragment} from "react";
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'
import TeamCard from './TeamCard';

class TeamSearch extends React.Component{
    state={
        teamsAvailable: []
    }
    componentDidMount(){
        fetch("http://localhost:3000/api/v1/vacant_teams", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                sport_id: this.props.sportId
            })
        })
        .then(res => res.json())
        .then(teams => {
            console.log(teams)
            this.setState({teamsAvailable: teams.teams.data})
        })
    }

    render(){
        return (
        <div className="search-main">
            {this.state.teamsAvailable.length !== 0 ?
            <Fragment>
                {this.state.teamsAvailable.map(team => <TeamCard key={team.id} team={team.attributes}/>)}
            </Fragment>
            :
            <div className="dash_main">
                <h1 className="main_text" >Sorry, there are no teams created for this type of sport yet.</h1>
                <h1 className="main_text" >It's a great opportunity to be the first: </h1>
                <NavLink to="/dashboard" className="main_text">Go back to dashboard...</NavLink>
            </div>
            }
        </div>
        );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp, { setUser })(TeamSearch)