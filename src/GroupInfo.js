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
                            {this.props.myGroup.events.map(event => <EventCard key={event.id} event={event} />)}
                            {/* {
                                this.props.myTeam.attributes.groups.length !== 0?
                                <Fragment>
                                    <h1 className="main_text" style={{textAlign: "left"}}>Your groups:</h1>
                                    <div className="small_cards">
                                        {this.props.myTeam.attributes.groups.map(group => <GroupCard key={group.id} group={group} add={0} dash_style={true}/>)}
                                    </div>
                                </Fragment>
                                :
                                null
                            }
                            {
                                this.props.myEvents.find(event => event.attributes.teams.find(team => team.id === this.props.myTeam.attributes.id))?
                                <Fragment>
                                    <h1 className="main_text" style={{textAlign: "left"}}>Your events:</h1>
                                    {this.props.myEvents.map(event => event.attributes.teams.find(team => team.id === this.props.myTeam.attributes.id)  ? <EventCard key={event.attributes.id} event={event.attributes} status_check={1} /> : null)}  
                                </Fragment>
                                :
                                null
                            } */}
                            {/* <h1>Your events:</h1>
                            {this.props.currentUser.user.data.attributes.events.map(event => <EventCard key={event.id} event={event} status_check={1} />)} */}
                            {/* <h1 className="main_text" style={{textAlign: "left"}}>Available:</h1>
                            {this.props.availableEvents.map(event => <EventCard key={event.attributes.id} event={event.attributes} />)} */}
                        </div>
                        <div className="team_info">
                            <h3>Group Info</h3>
                            {
                                this.props.myGroup.admin_id === this.props.currentUser.user.data.attributes.id ?
                                <button onClick={this.handleCreateEvent} style={{marginTop: "50px"}} className='dash_button'>Create Event</button>
                                :
                                null
                            }
                            {/* <p>Admin: <Link to={`/profile/@${this.props.myTeam.attributes.admin.username}`}><span class="avatar" style={{borderRadius: "50%"}}><img  src={this.props.myTeam.attributes.admin.profile_pic_path} /></span></Link></p>
                            {
                            this.props.myTeam.attributes.users.length > 5 ?
                                <div class="avatars">
                                    {this.props.myTeam.attributes.users.sort(() => 0.5 - Math.random()).slice(0, 3).map(user => <span class="avatar"><img  src={user.profile_pic_path} /></span>)}
                                    <span class="avatar" style={{backgroundColor: "#E8474C"}} title="More users"><h1>+{this.props.myTeam.attributes.users.length - 4}</h1></span>
                                </div>
                                :
                                <div class="avatars">
                                    {this.props.myTeam.attributes.users.sort(() => 0.5 - Math.random()).map(user => <span class="avatar"><Link to={`/profile/@${user.username}`}><img  src={user.profile_pic_path} title={user.username} /></Link></span>)}
                                </div>
                            }
                            <p className="team_mem_num">Number of members: {this.props.myTeam.attributes.number_of_members}</p>
                            <p className="team_score">Games won: {this.props.myTeam.attributes.won_games}</p>
                            <p className="team_score">Ties: {this.props.myTeam.attributes.tie_games}</p>
                            <p className="team_score">Games lost: {this.props.myTeam.attributes.lost_games}</p>
                            {this.props.myTeam.attributes.admin.id === this.props.currentUser.user.data.attributes.id ?
                            <button onClick={this.handleJoinGroup} className='dash_button' style={{marginBottom: "10px"}}>Join Group</button>
                            :
                            null
                            } */}
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