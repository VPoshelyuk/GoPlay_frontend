import React, {Fragment} from "react";
import { Redirect, withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import { setUser, setMyGroups  } from './redux/actions/user_actions'
import MaskedInput from 'react-maskedinput'
import 'react-phone-input-2/lib/bootstrap.css'
import PhoneInput from 'react-phone-input-2'
import TeamCard from './TeamCard'
import GroupCard from './GroupCard'
import LogOut from './LogOut'

class Profile extends React.Component{
    state = {
        user: "",
        user_info: null,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        location: "",
        profile_pic: "",
        phone_number: "",
        bio: "",
        password: "",
        loaded: false,
        edit: false,
        edited: false,
        deleted: false
    }

    componentDidMount(){
        fetch(`http://localhost:3000/api/v1/users`)
        .then(resp => resp.json())
        .then(users => {
            let user = users.users.data.find(user => user.attributes.username.toLowerCase() === this.props.match.params.username.toLowerCase())
            if(user){
                this.setState({
                    user: user,
                    username: user.attributes.username,
                    first_name: user.attributes.first_name,
                    last_name: user.attributes.last_name,
                    email: user.attributes.email,
                    profile_pic: user.attributes.profile_pic,
                    phone_number: user.attributes.phone_number,
                    bio: user.attributes.bio,
                    location: user.attributes.location,
                    password: user.attributes.password
                })
            }else{
                this.setState({
                    user: user
                })
            }
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
        const fD = new FormData()
        fD.append("first_name", this.state.first_name)
        fD.append("last_name", this.state.last_name)
        fD.append("username", this.state.username)
        fD.append("profile_pic_path", this.state.user.attributes.profile_pic_path)
        fD.append("location", this.state.location)
        fD.append("email", this.state.email)
        fD.append("phone_number", this.state.phone_number.match(/\d+/g).join(""))
        fD.append("birthday", this.state.user.attributes.birthday)
        fD.append("gender", this.state.user.attributes.gender)
        fD.append("bio", this.state.bio)
        fD.append("password", this.state.user.attributes.password)
        fD.append("admin", this.state.user.attributes.admin)
        fD.append("won_games", this.state.user.attributes.won_games)
        fD.append("lost_games", this.state.user.attributes.lost_games)
        fD.append("tie_games", this.state.user.attributes.tie_games)
        fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.user.data.attributes.id}`, {
        method: "PATCH",
        body: fD
        })
        .then(res => res.json())
        .then(resp => {
            this.props.setUser(resp)
            this.setState({
                user: resp.user.data,
                username: resp.user.data.attributes.username,
                first_name: resp.user.data.attributes.first_name,
                last_name: resp.user.data.attributes.last_name,
                email: resp.user.data.attributes.email,
                profile_pic: resp.user.data.attributes.profile_pic,
                phone_number: resp.user.data.attributes.phone_number,
                bio: resp.user.data.attributes.bio,
                location: resp.user.data.attributes.location,
                password: resp.user.data.attributes.password,
                edit: false,
                edited: true
            })
        })

    }

    handleUpdate = (e) => {
        this.setState({
            edit: true
        })
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
            this.setState({
                edited: false
            })
            return <Redirect to={`/profile/@${this.state.username}`} />
        }
        if(this.state.edit){
        return (
        <div className="signup-main">
            <form onSubmit={this.handleSubmit} className='form'>
            <p className='field half'>
                <label className='label' htmlFor='first_name'>First name</label>
                <input className='text-input' id='first_name' name='first_name' value={this.state.first_name} onChange={this.handleChange} type='text'/>
            </p>
            <p className='field half'>
                <label className='label' htmlFor='last_name'>Last name</label>
                <input className='text-input' id='last_name' name='last_name' value={this.state.last_name} onChange={this.handleChange} type='text'/>
            </p>
            <p className='field half'>
                <label className='label' htmlFor='username'>Username</label>
                <input className='text-input' id='username' name='username' value={this.state.username} onChange={this.handleChange} type='username' />
            </p>
            <p className='field half'>
                <label className='label' htmlFor='select'>Location</label>
                <select className='select' value={this.state.location} onChange={this.handleChange} name="location" id='select'>
                <option value=''></option>
                <option value='New York, NY'>New York, NY</option>
                <option value='Los Angeles, CA'>Los Angeles, CA</option>
                <option value='Miami, FL'>Miami, FL</option>
                </select>
            </p>
            <p className='field half'>
                <label className='label' htmlFor='email'>E-mail</label>
                <input className='text-input' id='email' name='email' value={this.state.email} onChange={this.handleChange} type='email' />
            </p>
            <div className='field half'>
                <label className='label' htmlFor='phone_number'>Phone</label>
                <PhoneInput
                    country={'us'}
                    disableDropdown={true}
                    value={this.state.phone_number}
                    onChange={phone_number => this.setState({ phone_number })}
                />
                {/* <input className='text-input' id='phone_number' name='phone_number' value={this.state.phone_number} onChange={this.handleChange} type='phone'/> */}
            </div>
            <p className='field'>
                <label className='label' htmlFor='bio'>Bio</label>
                <textarea className='textarea' cols='50' id='bio' name='bio' value={this.state.bio} onChange={this.handleChange} rows='4'></textarea>
            </p>
            <p className='field'>
                <input className='button' type='submit' value='Edit' />
            </p>
            </form>
        </div>
            )
                
        }
        if(this.state.user === undefined) return <h1 className="team_name" style={{color: "white"}}>Profile doesn't exist!</h1>
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
