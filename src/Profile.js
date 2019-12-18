import React, {Fragment} from "react";
import { Redirect, withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'
import LogOut from './LogOut'

class Profile extends React.Component{
    state = {
        user: "",
        username: "",
        phone_number: "",
        edited: false,
        deleted: false
    }

    componentDidMount(){
        fetch(`http://localhost:3000/api/v1/users`)
        .then(resp => resp.json())
        .then(users => {
            this.setState({
                user: users.users.data.find(user => user.attributes.username === this.props.match.params.username),
                username: this.props.currentUser.user.data.attributes.username,
                phone_number: this.props.currentUser.user.data.attributes.phone_number
            })
        })
    }

    componentDidUpdate(){
        console.log("hi1")
        fetch(`http://localhost:3000/api/v1/users`)
        .then(resp => resp.json())
        .then(users => {
            this.setState({
                user: users.users.data.find(user => user.attributes.username === this.props.match.params.username),
                username: this.props.currentUser.user.data.attributes.username,
                phone_number: this.props.currentUser.user.data.attributes.phone_number
            })
        })
    }

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
            <Fragment>
                {this.state.user.attributes !== undefined ?
                <Fragment>
                {this.state.user.attributes.username === this.props.currentUser.user.data.attributes.username ?
                    <Fragment>
                    <div className="login-main">
                        <img src={this.props.currentUser.user.data.attributes.profile_pic} alt="" style={{borderRadius: "50px", marginTop: "50px"}}/>
                        <h1 className="team_name">{this.props.currentUser.user.data.attributes.username}</h1>
                        <h1>Edit your profile:</h1>
                        <form className="form1" onSubmit={this.handleSubmit}>
                            <p>Username:</p>
                            <input className="un" type="text" align="center" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Userame" />
                            <p>Phone Number:</p>
                            <input className="un" type="text" align="center" name="phone_number" value={this.state.phone_number} onChange={this.handleChange} placeholder="Phone Number" />
                            <input style={{marginBottom: "10px"}} className="submit" align="center" type="submit" value="Edit" />
                        </form>
                        <button style={{fontSize: "65px", margin: "10px"}} className="submit" onClick={this.handleDelete}>Delete your Profile</button>
                    </div>
                    </Fragment>
                    :
                    <Fragment>
                    <div className="login-main">
                        <img src={this.state.user.attributes.profile_pic} alt="" style={{borderRadius: "50px", marginTop: "50px"}}/>
                        <h1 className="team_name">{this.state.user.attributes.username}</h1>
                    </div>
                    </Fragment>
                }
                </Fragment>
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

export default withRouter(connect(msp, { setUser })(Profile))
