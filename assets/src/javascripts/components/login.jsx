import React from 'react';
import { Modal, Button, FormControl, Panel, FormGroup, InputGroup, ButtonToolbar, OverlayTrigger, Popover } from 'react-bootstrap';
import LoadingButton from '../components/loadingButton'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom'
export default class ModalPop extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 'login',
            Edison_token: localStorage.Edison_token,
        }
    }
    componentDidMount() {
        fetch('http://bigdata-view.cootekservice.com:50056/jwt', {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'bearer ' + localStorage.Edison_token,
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
            .catch(ex => {
                localStorage.removeItem('Edison_token');
            })
        this.setState({ Edison_token: localStorage.Edison_token })
    }
    signout = () => {
        this.props.signout()
        this.setState({ Edison_token: localStorage.Edison_token })
    }

    changeType = () => {
        if (this.state.type === 'login') {
            this.setState({ type: 'regist' });
        } else {
            this.setState({ type: 'login' });
        }
    }
    render() {
        const popoverLeft = (
            <Popover  title="error" id='error'>
                登录失败，请重新输入
            </Popover>
        );

        let login = (
            <Panel header="Login">
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>Username</InputGroup.Addon>
                        <FormControl type="text" value={this.props.loginUsername} onChange={this.props.handleLoginUsername} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>Password</InputGroup.Addon>
                        <FormControl type="password" value={this.props.loginPassword} onChange={this.props.handleLoginPassword} />
                    </InputGroup>
                </FormGroup>
                <ButtonToolbar>
                    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverLeft}>
                        <Button bsStyle={!(this.state.Edison_token === undefined) ? 'default' : "primary"} onClick={this.props.login} >Login</Button>
                    </OverlayTrigger>
                    <Button bsStyle={(this.state.Edison_token === undefined) ? 'default' : "primary"} onClick={this.signout}>Sign out</Button>
                    {/* <Button onClick={this.props.jwt} >Regist</Button> */}
                </ButtonToolbar>
                {this.props.islogin
                    ? <Redirect to="/authority" />
                    : false}

            </Panel>
        )
        let regist = (
            <Panel header="Regist">
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>Username</InputGroup.Addon>
                        <FormControl type="text" />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>password</InputGroup.Addon>
                        <FormControl type="text" />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>password again</InputGroup.Addon>
                        <FormControl type="text" />
                    </InputGroup>
                </FormGroup>
                <ButtonToolbar>
                    <Button bsSize="large" onClick={this.changeType} >Login</Button>
                    <Button bsStyle="primary" bsSize="large" >Regist</Button>
                </ButtonToolbar>
            </Panel>
        )
        return (
            <div>
                {this.state.type === 'login'
                    ? login
                    : regist}
            </div>
        )
    }
}