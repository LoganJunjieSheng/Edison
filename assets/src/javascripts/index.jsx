import React from 'react';
import { Col } from 'react-bootstrap';
import fetch from 'node-fetch';

import Login from './components/login'
import '../stylesheets/index.css'

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            login: {
                username: '',
                password: '',
            },

        }
    }
    handleLoginUsername = (e) => {
        let login = Object.assign({}, this.state.login);
        login.username = e.target.value;
        this.setState({ login })
    }
    handleLoginPassword = (e) => {
        let login = Object.assign({}, this.state.login);
        login.password = e.target.value;
        this.setState({ login })
    }
    login = () => { 
        fetch('http://bigdata-view.cootekservice.com:50056/test', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.login.username,
                password: this.state.login.password
            })
        })
            .then(res => { console.log(res) })

    }
    render() {
        return (
            <div>
                <Col xsHidden smHidden md={12}><div className="placeholder-h30"></div></Col>
                <Col xsHidden smHidden md={3}></Col>
                <Col xs={12} md={6}>
                    <Login
                        loginUsername={this.state.login.username}
                        loginPassword={this.state.login.password}

                        handleLoginUsername={this.handleLoginUsername}
                        handleLoginPassword={this.handleLoginPassword}
                        login={this.login}
                    >
                    </Login>
                </Col>
                <Col xsHidden smHidden md={3}></Col>
            </div>

        );
    }
}


