import React, {Fragment} from "react";
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { setGroup } from './redux/actions/team_actions'

class GroupInfo extends React.Component{
    state = {
        loaded: false
    }

    componentDidMount(){
        console.log(this.props)
        fetch(`http://localhost:3000/api/v1/groups/${this.props.match.params.id}`)
        .then(resp => resp.json())
        .then(group => {
            console.log(group.group.data.attributes)
            this.props.setGroup(group.group.data.attributes)
            this.setState({
                loaded:true
            })
        })
    }

    render(){
        return (
            <Fragment>
            {
                this.state.loaded?
                <div className="team_main">
                    <h1 className="team_name">{this.props.myGroup.name}</h1>
                    <p className="team_location">{this.props.myGroup.location}</p>
                    <img className="team_logo" src={this.props.myGroup.logo_path} alt="group_logo" />
                    <h2 className="team_desc">{this.props.myGroup.description}</h2>
                    {
                        this.props.myGroup.admin_id === this.props.currentUser.user.data.attributes.id ?
                        <button onClick={this.handleViewGroup} style={{marginTop: "50px"}} className='dash_button'>Create Event</button>
                        :
                        null
                    }
                </div>
                :
                <div className="loading">
                        <div className="lds-spinner"><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div></div>
                </div>
            }
            </Fragment>
        )
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        myTeam: state.teamReducer.myTeam,
        myGroup: state.teamReducer.myGroup,
        sportId: state.teamReducer.currentSportId
    }
}

export default withRouter(connect(msp, { setGroup })(GroupInfo))
// changeViewStatus on all button presses