import React from 'react';
import { Modal, Button, FormControl, Panel, FormGroup, InputGroup, ButtonToolbar } from 'react-bootstrap';
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
    signout=()=>{
        this.props.signout()
        this.setState({Edison_token: localStorage.Edison_token})
    }

    changeType = () => {
        if (this.state.type === 'login') {
            this.setState({ type: 'regist' });
        } else {
            this.setState({ type: 'login' });
        }
    }
    render() {
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
                    <Button bsStyle={!(this.state.Edison_token === undefined) ? 'default' : "primary"} onClick={this.props.login}>Login</Button>
                    <Button bsStyle={(this.state.Edison_token === undefined) ? 'default' : "primary"} onClick={this.signout}>Sign out</Button>
                    <Button onClick={this.props.jwt} >Regist</Button>
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