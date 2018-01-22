import React from 'react';
import { Modal, Button, FormControl, Panel, FormGroup, InputGroup, ButtonToolbar } from 'react-bootstrap';
import LoadingButton from '../components/loadingButton'

export default class ModalPop extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 'login'
        }
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
                        <FormControl type="text" value={this.props.loginPassword} onChange={this.props.handleLoginPassword} />
                    </InputGroup>
                </FormGroup>
                <ButtonToolbar>
                    <Button bsStyle="primary" bsSize="large" onClick={this.props.login}>Login</Button>
                    <Button bsSize="large" onClick={this.props.jwt} >Regist</Button>
                </ButtonToolbar>
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