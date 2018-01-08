import React from 'react';
import { Button, ButtonToolbar, Col, Glyphicon, Modal, Table, Panel, ListGroup, ListGroupItem, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import UserAndGroup from './components/userAndGroup'
import GroupRow from './components/groupRow'
import UserRow from './components/userRow'

import '../stylesheets/index.css'
export default class Authority extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userOrGroup: 'group',
            modalDelete: {
                show: false,
                type: '',
                value: '',
            },
            modalEditGroup: {
                show: false,
                type: '',
                value: '',
                data: [],
                userInput: '',
            },
            modalAddGroup:{
                show:false,
                
            }
        }
    }
    componentDidMount() {
        // this.setState({
        //     userOrGroup: 'group',
        // })
    }
    switchUserOrGroup = () => {
        if (this.state.userOrGroup === 'group') {
            this.setState({ userOrGroup: 'user', })
        } else {
            this.setState({ userOrGroup: 'group', })
        }
    }
    renderButtonToolbar = () => {
        if (this.state.userOrGroup === 'group') {
            return (
                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={this.switchUserOrGroup} >User</Button>
                    <Button disabled  >Group</Button>
                </ButtonToolbar>
            );
        } else {
            return (
                <ButtonToolbar>
                    <Button disabled  >User</Button>
                    <Button bsStyle="primary" onClick={this.switchUserOrGroup} >Group</Button>
                </ButtonToolbar>
            );
        }

    }
    close = () => {
        let modalDelete = Object.assign({}, this.state.modalDelete);
        modalDelete.show = false;
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        modalEditGroup.show = false;

        this.setState({
            modalDelete: modalDelete,
            modalEditGroup: modalEditGroup,

        })
    }
    deleteRow = (type, value) => {
        console.log(type + '_' + value)
        let modalDelete = Object.assign({}, this.state.modalDelete);
        modalDelete.show = true;
        modalDelete.type = type;
        modalDelete.value = value;

        this.setState({
            modalDelete: modalDelete
        })
    }
    delete = () => {
        let modalDelete = Object.assign({}, this.state.modalDelete);
        modalDelete.show = false;
        console.log(modalDelete)
        this.setState({
            modalDelete: modalDelete
        })
    }
    //group add user
    modalEditGroup = (type, value) => {
        console.log(type + '_' + value + ' editRow')
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        modalEditGroup.show = true;
        modalEditGroup.type = type;
        modalEditGroup.value = value;
        modalEditGroup.data = ['user1', 'user2', 'user3'];
        this.setState({
            modalEditGroup: modalEditGroup
        })
    }
    handleGroupInputUser = (e) => {
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        modalEditGroup.userInput = e.target.value;
        this.setState({ modalEditGroup: modalEditGroup })
    }
    groupAddUser = () => {
        let repeat = 0;
        if (this.state.modalEditGroup.userInput) {
            let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
            modalEditGroup.data.map((item, index) => {
                if ((item === this.state.modalEditGroup.userInput)) {
                    repeat = 1;
                }
            })
            if (!repeat) {
                modalEditGroup.data.unshift(modalEditGroup.userInput);
                modalEditGroup.userInput = '';
                this.setState({
                    modalEditGroup: modalEditGroup
                })
            }
        }

    }
    groupDeleteUser = (username) => {
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        modalEditGroup.data.map((item, index) => {
            if (item === username) {
                modalEditGroup.data.splice(index, 1);
            }
        })
        this.setState({
            modalEditGroup: modalEditGroup
        })
    }
    editGroup = () => {
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        modalEditGroup.show = false;
        this.setState({
            modalEditGroup: modalEditGroup
        })
    }
    //group add group


    render() {
        let renderModalDelete = () => {
            return (
                <Modal
                    show={this.state.modalDelete.show}
                    onHide={this.close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete the <span className='strong'>{this.state.modalDelete.value}</span>({this.state.modalDelete.type}) </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure to delete the <span className='strong'>{this.state.modalDelete.value}</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Cannel</Button>
                        <Button bsStyle="primary" onClick={this.delete}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
        let renderModalEditGroup = () => {
            return (
                <Modal
                    show={this.state.modalEditGroup.show}
                    onHide={this.close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit the <span className='strong'>{this.state.modalEditGroup.value}</span>({this.state.modalEditGroup.type}) </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Panel header="User List">
                            <FormGroup>
                                <InputGroup>
                                    <InputGroup.Button>
                                        <Button onClick={this.groupAddUser}><Glyphicon glyph="plus" />Add</Button>
                                    </InputGroup.Button>
                                    <FormControl type="text" placeholder='user name' value={this.state.modalEditGroup.userInput}
                                        onChange={(e) => this.handleGroupInputUser(e)} />
                                </InputGroup>
                            </FormGroup>
                            <ListGroup fill >
                                {this.state.modalEditGroup.data.map((item, index) => {
                                    return (
                                        <ListGroupItem key={item}>
                                            <span className='btn-mr20'>{item}</span>
                                            <Button bsStyle="danger" bsSize="xsmall"
                                                onClick={() => this.groupDeleteUser(item)}><Glyphicon glyph="trash" /></Button>
                                        </ListGroupItem>
                                    )
                                })}
                            </ListGroup>
                        </Panel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Cannel</Button>
                        <Button bsStyle="primary" onClick={this.editGroup}>Edit</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
        let renderModalAddGroup = () => {
            return(
                <Modal
                show={this.state.modalEditGroup.show}
                onHide={this.close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit the <span className='strong'>{this.state.modalEditGroup.value}</span>({this.state.modalEditGroup.type}) </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Panel header="User List">
                        <FormGroup>
                            <InputGroup>
                                <InputGroup.Button>
                                    <Button onClick={this.groupAddUser}><Glyphicon glyph="plus" />Add</Button>
                                </InputGroup.Button>
                                <FormControl type="text" placeholder='user name' value={this.state.modalEditGroup.userInput}
                                    onChange={(e) => this.handleGroupInputUser(e)} />
                            </InputGroup>
                        </FormGroup>
                        <ListGroup fill >
                            {this.state.modalEditGroup.data.map((item, index) => {
                                return (
                                    <ListGroupItem key={item}>
                                        <span className='btn-mr20'>{item}</span>
                                        <Button bsStyle="danger" bsSize="xsmall"
                                            onClick={() => this.groupDeleteUser(item)}><Glyphicon glyph="trash" /></Button>
                                    </ListGroupItem>
                                )
                            })}
                        </ListGroup>
                    </Panel>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Cannel</Button>
                    <Button bsStyle="primary" onClick={this.editGroup}>Edit</Button>
                </Modal.Footer>
            </Modal>
            )
         }
        const group = [
            {
                type: 'group',
                group: 'group1',
                description: 'description1',
                users: 'user1',
                jsx: (
                    <GroupRow
                        type={'group'}
                        group={'group1'}
                        description={'description1'}
                        users={'user1'}

                        Edit={this.modalEditGroup}
                        Delete={this.deleteRow}
                    />
                )
            },
            {
                type: 'group',
                group: 'group2',
                description: 'description2',
                users: 'user2',
                jsx: (
                    <GroupRow
                        type={'group'}
                        group={'group2'}
                        description={'description2'}
                        users={'user2'}

                        Edit={this.modalEditGroup}
                        Delete={this.deleteRow}
                    />
                )
            },
        ];
        const user = [
            {
                type: 'user',
                groups: 'group1',
                description: 'description1',
                user: 'user1',
                jsx: (
                    <UserRow
                        groups={'group1'}
                        description={'description1'}
                        user={'user1'}
                    />
                )
            },
            {
                type: 'user',
                groups: 'group2',
                description: 'description2',
                user: 'user2',
                jsx: (
                    <UserRow
                        groups={'group2'}
                        description={'description2'}
                        user={'user2'}
                    />
                )
            },
        ];
        return (
            <div>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={10}>
                    {this.renderButtonToolbar()}
                    <UserAndGroup
                        userOrGroup={this.state.userOrGroup}
                        data={group}
                    />

                </Col>

                <Col xsHidden smHidden md={1}></Col>
                {renderModalDelete()}
                {renderModalEditGroup()}
                {renderModalAddGroup()}
            </div>
        )
    }
}