import React, {PureComponent} from 'react';
import {Nav, NavItem, Navbar} from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Route,
    Link,
    NavLink
} from 'react-router-dom'
import Index from "../index";


export default class Navigation extends React.PureComponent {
    render() {
        return (
            <Router>
                <div>
                    <Navbar collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a><Link to="/">Edison</Link></a>
                            </Navbar.Brand>
                            <Navbar.Toggle/>
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav>
                                <NavItem eventKey={1}><NavLink to="/operation">Operation and maintenance tools</NavLink></NavItem>
                                <NavItem eventKey={2}><NavLink to="/">Authority management</NavLink></NavItem>
                                <NavItem eventKey={2} href="#">Data monitoring alarm</NavItem>
                            </Nav>
                            <Nav pullRight>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>

                    {/*<Route exact path="/" component={Index}/>*/}
                </div>
            </Router>
        );
    }
}
