import React from 'react';
import { Col } from 'react-bootstrap';
import fetch from 'node-fetch';

import Login from './components/login'
import '../stylesheets/index.css'

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            islogin: false,
            login: {
                username: 'sjj',
                password: 'sjj',
                token: ''
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
                // 'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…c4OH0.ZKYS2xj5C4-l2k1ppyG8JnyZwvWLMNb2yWshM1XsNxA',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.login.username,
                password: this.state.login.password,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                // let login = Object.assign({}, this.state.login);
                // login.token = json.token;
                 
                localStorage.Edison_token = json.token;
                this.setState({ islogin: true })
            })
    }
    jwt = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/jwt', {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'bearer ' + localStorage.Edison_token,
                // 'Authorization': 'bearer ' + this.state.login.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.props.token
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
            })
    }
    signout = () => {
        localStorage.removeItem('Edison_token');
        this.setState({ islogin: false })
        console.log(localStorage.Edison_token)
    }


    render() {
        return (
            <div>

                <Col xsHidden smHidden md={12}><div className="placeholder-h30"></div></Col>
                <Col xsHidden smHidden md={3}></Col>
                <Col xs={12} md={6}>
                    <Login
                        islogin={this.state.islogin}
                        loginUsername={this.state.login.username}
                        loginPassword={this.state.login.password}

                        handleLoginUsername={this.handleLoginUsername}
                        handleLoginPassword={this.handleLoginPassword}
                        login={this.login}
                        signout={this.signout}
                        jwt={this.jwt}
                    >
                    </Login>

                </Col>
                <Col xsHidden smHidden md={3}></Col>
            </div>

        );
    }
}


