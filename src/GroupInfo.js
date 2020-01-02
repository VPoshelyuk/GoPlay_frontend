import React, {Fragment} from "react";
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { setGroup } from './redux/actions/team_actions'
import EventCard from './EventCard';

class GroupInfo extends React.Component{
    state = {
        loaded: false,
        creatingEvent: false
    }

    handleCreateEvent = () => {
        this.setState({
            creatingEvent: true
        })
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
        console.log(this.props.myGroup)
        if(this.state.creatingEvent){
            this.setState({
                creatingEvent: false
            })
            return <Redirect to='/create_event' />
        }
        return (
            <Fragment>
            {
                this.state.loaded?
                <div className="dash_main" style={{marginTop: "13vh"}}>
                    <div className="top_dash">
                        <div className="logos_div">
                            <img className="team_logo" src={this.props.myGroup.logo_path} alt="group_logo" />
                        </div>
                        <h1 className="team_name">{this.props.myGroup.name}</h1>
                        <div className="location_div">
                            <p className="team_location">{this.props.myGroup.location}</p>
                            <img className="activity_logo" src={this.props.myGroup.activity.logo_path} alt="sport_logo_path" />
                        </div>
                    </div>
                    <div className="desc_info">
                        <div className="desc_groups">
                            <h2 className="team_desc">{this.props.myGroup.description}</h2>
                            {this.props.myGroup.events.sort(function(a,b) {
                            a = a.time.split('/').reverse().join('');
                            b = b.time.split('/').reverse().join('');
                            return a > b ? 1 : a < b ? -1 : 0;
                            // return a.localeCompare(b);         // <-- alternative 
                            }).map(event => <EventCard key={event.id} event={event} />)}
                        </div>
                        <div className="team_info">
                            {
                                this.props.myGroup.admin_id === this.props.currentUser.user.data.attributes.id ?
                                <button onClick={this.handleCreateEvent} style={{marginTop: "50px"}} className='dash_button'>Create Event</button>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="lds-spinner"><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div></div>

            }
            </Fragment>
        )
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        myTeam: state.teamReducer.currentTeam,
        myGroup: state.teamReducer.currentGroup,
        sportId: state.teamReducer.currentSportId
    }
}

export default withRouter(connect(msp, { setGroup })(GroupInfo))
// changeViewStatus on all button presses