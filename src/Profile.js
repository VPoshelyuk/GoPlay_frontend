import React, {Fragment} from "react";
import { Redirect, withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import { setUser, setMyGroups  } from './redux/actions/user_actions'
import TeamCard from './TeamCard'
import GroupCard from './GroupCard'
import LogOut from './LogOut'

class Profile extends React.Component{
    state = {
        user: "",
        user_info: null,
        username: "",
        phone_number: "",
        loaded: false,
        edited: false,
        deleted: false
    }

    componentDidMount(){
        fetch(`http://localhost:3000/api/v1/users`)
        .then(resp => resp.json())
        .then(users => {
            this.setState({
                user: users.users.data.find(user => user.attributes.username.toLowerCase() === this.props.match.params.username.toLowerCase()),
            })
        })
        fetch("http://localhost:3000/api/v1/my_groups", {
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
        .then(groups => {
            console.log(groups)
            this.props.setMyGroups(groups.groups.data)
                this.setState({
                    loaded: true
                })
        })

    }

    // componentDidUpdate(){
    //     console.log("hi1")
    //     fetch(`http://localhost:3000/api/v1/users`)
    //     .then(resp => resp.json())
    //     .then(users => {
    //         this.setState({
    //             user: users.users.data.find(user => user.attributes.username === this.props.match.params.username),
    //             username: this.props.currentUser.user.data.attributes.username,
    //             phone_number: this.props.currentUser.user.data.attributes.phone_number
    //         })
    //     })
    // }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
    }
    
    handleSubmit = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.user.data.attributes.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username: this.state.username,
            phone_number: this.state.phone_number
        })
        })
        .then(res => res.json())
        .then(resp => this.props.setUser(resp))
        .then(this.setState({
            edited: true
        }))
    }

    handleDelete = () => {
        fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.user.data.attributes.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        })
        .then(this.setState({deleted: true}))
    }

    render(){
        console.log(this.props, this.state)
        if(this.state.deleted)return <LogOut logout={this.props.logout} />
        if(this.state.edited){
            this.setState({edited: false})
            return <Redirect to={`/profile/@${this.state.username}`} />
        }
        if(this.state.user === undefined) return <h1 className="team_name">Profile doesn't exist!</h1>
        // console.log(this.state.user.attributes)
        return (
            <div className="dash_main" style={{marginTop: "13vh"}}>
                {this.state.user.attributes !== undefined ?
                <Fragment>
                    <div className="profileHat">
                        <div className="userImg">
                            <img className="userImg" src={this.state.user.attributes.profile_pic_path} alt="profile_pic"/>
                        </div>
                        <div className="prettyfyUserNames">
                            <div className="userNames">
                                <h1 className="user_info">{this.state.user.attributes.username}</h1>
                                <h1 className="user_info">{this.state.user.attributes.first_name} {this.state.user.attributes.last_name}</h1>
                                <h1 className="user_info">{this.state.user.attributes.birthday}</h1>
                                <h1 className="user_info">{this.state.user.attributes.gender}</h1>
                                <h1 className="user_info">{this.state.user.attributes.location}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="myActivities">
                        {this.state.user.attributes.activities.map(activity => <img src={activity.logo_path} alt="activity_pic"/>)}
                    </div>
                    <div className="profileDescDiv">
                        <h1 className="profile_desc">{this.state.user.attributes.bio}</h1>
                    </div>
                    {this.state.user.attributes.teams.length !== 0 ?
                        <Fragment>
                            <p>My teams</p>
                            <div className="myTeams">
                                {this.state.user.attributes.teams.map(team => <TeamCard key={team.id} team={team} profile_acc={true} dash_style={true}/>)}
                            </div>
                        </Fragment>
                        :
                        <p>No teams yet</p>
                    }
                    {/* {this.state.user.attributes.teams.map(team => <TeamCard key={team.id} team={team} profile_acc={true} dash_style={true}/>)} */}
                    
                {this.state.user.attributes.username === this.props.currentUser.user.data.attributes.username ?
                    <Fragment>
                        {
                            this.state.loaded ?
                            <Fragment>
                                <p>Groups, where I am Admin</p>
                                <div className="myTeams">
                                    {this.props.myGroups.map(group => <GroupCard key={group.attributes.id} group={group.attributes} profile_acc={true} dash_style={true}/>)}
                                </div>
                            </Fragment>
                            :
                            <div className="lds-spinner"><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div></div>
                        }
                        <button onClick={this.handleUpdate} style={{marginTop: "20px", marginBottom: "10px"}} className='dash_button'>Edit Profile</button>
                        <button onClick={this.handleDelete} style={{marginTop: "20px", marginBottom: "10px"}} className='dash_button'>Delete Profile</button>
                    </Fragment>
                    :
                    null
                }
                </Fragment>
                :
                <div className="lds-spinner"><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div></div>

                }
            </div>
        );
    }
}

function msp(state){
    return {
      currentUser: state.userReducer.currentUser,
      myGroups: state.userReducer.myAdminGroups
    }
}

export default withRouter(connect(msp, { setUser, setMyGroups  })(Profile))
