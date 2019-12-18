import React, {Fragment} from 'react';
import {Link, NavLink} from "react-router-dom";
import { connect } from 'react-redux'

function NavBar (props) {

    const hideMenu = () => {
        const toggler = document.querySelector(".toggler")
        toggler.checked = false
    }

    return (
        <header>
            <NavLink to="/"><img className="logo" src="http://localhost:3001/images/nav_logo.png" alt="NavBar logo"/></NavLink> 
            {/* werd stuff with img path */}
            <div className="menu-wrap">
                <input type="checkbox" className="toggler"/>
                <div className="hamburger"><div></div></div>
                <div className="menu">
                    <div>
                        <div>
                            <ul onClick={hideMenu}> 
                                {props.currentUser === null ?
                                <Fragment>
                                    <li>
                                    <Link to="/">Home</Link>
                                    </li>
                                    <li>
                                    <Link to="/login">Log In</Link>
                                    </li>
                                    <li>
                                    <Link to="/signup">Sign Up</Link>
                                    </li>
                                </Fragment>
                                :
                                <Fragment>
                                    <li>
                                    <Link to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li>
                                    <Link to="/groups">Groups</Link>
                                    </li>
                                    <li>
                                    <Link to={`/profile/@${props.currentUser.user.data.attributes.username}`} >{props.currentUser.user.data.attributes.username}</Link>
                                    </li>
                                    <li>
                                    <Link to="/logout">Log Out</Link>
                                    </li>
                                </Fragment>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function msp(state){
    return {
      currentUser: state.userReducer.currentUser
    }
  }
  
  export default connect(msp)(NavBar)
  