import React, {Fragment} from "react";
import { Redirect } from "react-router-dom"
import LogOut from './LogOut'

export default class CardsContainer extends React.Component{
    state = {
        clicked: false,

        fname: "",
        lname: "",
        phonenumber: "",
        username: "",
        password_digest: "",

        deleted: false
    }

    componentDidMount(){
        this.renderMyInfo()
    }

    renderMyInfo = () => {
        fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.id}`)
            .then(res => res.json())
            .then(userInfo => this.setState({
                fname: userInfo.user.fname,
                lname: userInfo.user.lname,
                phonenumber: userInfo.user.phonenumber,
                username: userInfo.user.username,
                password_digest: userInfo.user.password_digest
            }))
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
      }
    
    handleSubmit = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            fname: this.state.fname,
            lname: this.state.lname,
            phonenumber: this.state.phonenumber,
            username: this.state.username,
            passpassword_digest: this.state.password_digest
        })
        })
        .then(res => res.json())
        .then(resp => this.props.setUser(resp))
    }

    handleDelete = () => {
        fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        })
        .then(this.setState({deleted: true}))
    }

    cardClicked = () => {
        this.setState({
            clicked: true
        })
    }

    render(){
        if(this.state.deleted){
            this.setState({deleted: false})
            return <LogOut logout={this.props.logout} />
        }
        return (
            <Fragment>
            {!this.state.clicked ?
                <Fragment>
                <div className="my_cards">
                    <h1>Edit your profile:</h1>
                    <form className="form1" onSubmit={this.handleSubmit}>
                        <p>First Name:</p>
                        <input className="un" type="text" align="center" name="fname" value={this.state.fname} onChange={this.handleChange} placeholder="First Name" />
                        <p>Last Name:</p>
                        <input className="un" type="text" align="center" name="lname" value={this.state.lname} onChange={this.handleChange} placeholder="Last Name" />
                        <p>Phone Number:</p>
                        <input className="un" type="text" align="center" name="phonenumber" value={this.state.phonenumber} onChange={this.handleChange} placeholder="Phone Number" />
                        <p>Username:</p>
                        <input className="un" type="text" align="center" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                        <input style={{marginBottom: "10px"}} className="submit" align="center" type="submit" value="Edit" />
                    </form>
                    <button style={{fontSize: "65px", margin: "10px"}} className="submit" onClick={this.handleDelete}>DE-Culturize(Delete your Profile)</button>
                </div>
                </Fragment>
                :
                <Redirect to="/event" />
            }
            </Fragment>
        );
    }
}

// chooseEvent={this.props.chooseEvent} cardClicked={this.props.cardClicked}
