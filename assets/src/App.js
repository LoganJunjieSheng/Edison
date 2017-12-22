import React from 'react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Route,
    Link,
    NavLink
} from 'react-router-dom'
// import Navigation from './javascripts/components/nav';
import Index from './javascripts/index';
import Operation from './javascripts/operationAndMaintenance';
import Authority from './javascripts/authorityManagement';
import Alarm from './javascripts/dataMonitoringAndAlarm';

import './stylesheets/app.css'

class App extends React.PureComponent {
    render() {
        return (
            <Router>
                <div>
                    <Navbar >
                        <Navbar.Header>
                            <Navbar.Brand>
                                <NavLink to="/">Edison</NavLink>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav>
                                <NavItem><NavLink tag={Link}to="/operation">Operation and maintenance tools</NavLink></NavItem>
                                <NavItem><NavLink tag={Link} to="/authority">Authority management</NavLink></NavItem>
                                <NavItem><NavLink tag={Link} to="/alarm">Data monitoring and alarm</NavLink></NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Route exact path="/" component={Index} />
                    <Route path="/operation" component={Operation} />
                    <Route path="/authority" component={Authority} />
                    <Route path="/alarm" component={Alarm} />
                </div>
            </Router>
        );
    }
}

export default App;
