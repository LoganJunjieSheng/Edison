import React from 'react';
import { Col } from 'react-bootstrap';
import fetch from 'node-fetch';
import Login from './components/login'
import '../stylesheets/index.css'
import { log } from 'util';
// md5 = require('js-md5');
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            islogin: false,
            defeat_login: false,
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
        var md5 = require('md5');
        fetch('http://bigdata-view.cootekservice.com:50056/test', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.login.username,
                password: md5(this.state.login.password),
            })
        })
            .then(res => res.json())
            .then(json => {
                localStorage.Edison_token = json.token;
                this.setState({ islogin: true })
            })
            .catch(ex => {
                let login = Object.assign({}, this.state.login);
                login.username = '';
                login.password = '';
                this.setState({
                    login: login,
                    defeat_login: true
                })
            })
    }
    // jwt = () => {
    //     fetch('http://bigdata-view.cootekservice.com:50056/jwt', {
    //         method: "POST",
    //         mode: "cors",
    //         headers: {
    //             'Authorization': 'bearer ' + localStorage.Edison_token,
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             token: this.props.token
    //         })
    //     })
    //         .then(res => res.json())
    //         .then(json => {
    //             console.log(json)
    //         })
    // }
    signout = () => {
        localStorage.removeItem('Edison_token');
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
                    // jwt={this.jwt}
                    >
                    </Login>

                </Col>
                <Col xsHidden smHidden md={3}></Col>
            </div>

        );
    }
}


