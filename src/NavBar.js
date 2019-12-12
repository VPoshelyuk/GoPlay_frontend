import React, {Fragment} from 'react';
import {Link} from "react-router-dom";

export default function NavBar (props) {

    const hideMenu = () => {
        const toggler = document.querySelector(".toggler")
        toggler.checked = false
    }

    return (
        <header>
            <Link to="/"><img className="logo" src="./images/nav_logo.png" alt="NavBar logo"/></Link>
            <div className="menu-wrap">
                <input type="checkbox" className="toggler"/>
                <div className="hamburger"><div></div></div>
                <div className="menu">
                    <div>
                        <div>
                            <ul onClick={hideMenu}> 
                                <li>
                                <Link to="/">Home</Link>
                                </li>
                                {props.currentUser === null ?
                                <Fragment>
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
                                    <Link to="/profile">{props.currentUser.username}</Link>
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
