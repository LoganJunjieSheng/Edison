import React from 'react';
import { Button, ButtonToolbar, Col, Glyphicon, Modal, Table, Panel, ListGroup, ListGroupItem, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import UserAndGroup from './components/userAndGroup'
import GroupRow from './components/groupRow'
import UserRow from './components/userRow'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import '../stylesheets/index.css'
import { stat } from 'fs';
export default class Authority extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userOrGroup: 'group',
            groupList: [],//[{type:'group',group:'',description:'',userNumber:num,userList:[]}]
            userList: [],
            activeList: [],
            optionsUser: [],

            optionsGroup: [],


            modalDelete: {
                show: false,
                type: '',
                value: '',
                index: null,
            },
            modalEditGroup: {
                show: false,
                type: '',
                value: '',
                data: [],
                index: null,
            },
            modalEditUser: {
                show: false,
                type: '',
                value: '',
                data: [],
                index: null,
            },
            modalAddGroup: {
                buttonControl: true,
                groupNameControl: 'error',
                show: false,
                groupName: '',
                description: '',
                data: [],
            },
            modalAddUser: {
                buttonControl: true,
                groupNameControl: 'error',
                show: false,
                userName: '',
                data: [],
            },
        }
    }
    componentDidMount() {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/group/getData', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({

            })
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                }
            })
            .then(json => {
                if (json === undefined) { return }
                console.log(json)
                let optionsUser = [];
                json.userName.map((item, index) => {
                    optionsUser.push({
                        label: item,
                        value: item,
                    })
                })
                this.setState({
                    userOrGroup: 'group',
                    groupList: json.groupList,
                    activeList: json.groupList,
                    optionsUser: optionsUser,
                    // optionsGroup: json.groupName,
                })
            })
            .catch(ex => { console.log(ex) })
    }
    redirectToGroup = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/group/getData', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },
            body: JSON.stringify({})



        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let optionsUser = [];
                json.userName.map((item, index) => {
                    optionsUser.push({
                        label: item,
                        value: item,
                    })
                })
                this.setState({
                    userOrGroup: 'group',
                    groupList: json.groupList,
                    activeList: json.groupList,
                    optionsUser: optionsUser,
                    // optionsGroup: json.groupName,
                })
            })
            .catch(ex => { console.log(ex) })
    }

    redirectToUser = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/user/getData', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },
            body: JSON.stringify({})

        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (json === undefined) { return }
                let optionsGroup = [];
                json.groupName.map((item, index) => {
                    optionsGroup.push({
                        label: item,
                        value: item,
                    })
                })
                this.setState({
                    userOrGroup: 'user',
                    groupList: json.userList,
                    activeList: json.userList,
                    optionsGroup: optionsGroup,
                })
            })
            .catch(ex => { console.log(ex) })


    }
    renderButtonToolbar = () => {
        if (this.state.userOrGroup === 'group') {
            return (
                <ButtonToolbar>
                    <Button onClick={this.redirectToUser} >User</Button>
                    <Button bsStyle="primary" disabled  >Group</Button>
                </ButtonToolbar>
            );
        } else {
            return (
                <ButtonToolbar>
                    <Button bsStyle="primary" disabled  >User</Button>
                    <Button onClick={this.redirectToGroup} >Group</Button>
                </ButtonToolbar>
            );
        }

    }
    close = () => {
        let modalDelete = Object.assign({}, this.state.modalDelete);
        modalDelete.show = false;
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        modalEditGroup.show = false;
        let modalEditUser = Object.assign({}, this.state.modalEditUser);
        modalEditUser.show = false;
        let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
        modalAddGroup.show = false;
        let modalAddUser = Object.assign({}, this.state.modalAddUser);
        modalAddUser.show = false;

        this.setState({
            modalDelete: modalDelete,
            modalEditGroup: modalEditGroup,
            modalEditUser: modalEditUser,
            modalAddGroup: modalAddGroup,
            modalAddUser, modalAddUser
        })
    }

    //group change description
    descriptionOnchange = (data, cellInfo) => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/group/editDescription', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({
                type: 'group',
                groupName: cellInfo.original.group,
                description: data,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (json.type === 'success') {
                    let activeList = this.state.activeList.slice(0);
                    activeList[cellInfo.index][cellInfo.column.id] = data;
                    this.setState({ activeList });
                } else {

                }
            })
    }
    //group delete group
    modalDeleteGroup = (cellInfo) => {
        let modalDelete = Object.assign({}, this.state.modalDelete);
        modalDelete.show = true;
        modalDelete.type = 'group';
        modalDelete.value = cellInfo.original.group;
        modalDelete.index = cellInfo.index;
        this.setState({
            modalDelete
        })
    }
    deleteGroupOver = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/group/deleteGroup', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({
                type: this.state.modalDelete.type,
                groupName: this.state.modalDelete.value,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let modalDelete = Object.assign({}, this.state.modalDelete);
                if (json.type === 'success') {
                    let activeList = this.state.activeList.slice(0);
                    activeList.splice(modalDelete.index, 1);
                    modalDelete.show = false;
                    this.setState({
                        modalDelete: modalDelete,
                        activeList: activeList,
                    })
                } else {
                    modalDelete.show = false;
                    this.setState({
                        modalDelete: modalDelete,
                    })
                }
            })
    }
    //group edit user
    modalEditGroup = (cellInfo) => {
        // console.log(type + '_' + value + ' editRow')
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        modalEditGroup.show = true;
        modalEditGroup.type = 'group';
        modalEditGroup.value = cellInfo.original.group;
        modalEditGroup.data = cellInfo.original.userList.split(',');
        modalEditGroup.index = cellInfo.index;
        this.setState({
            modalEditGroup
        })
    }
    editGroupOnchange = (e) => {
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        const temp = e.map((item) => item.value)
        modalEditGroup.data = temp;
        this.setState({ modalEditGroup })
    }
    editGroupOver = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/group/editUserList', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({
                type: 'group',
                groupName: this.state.modalEditGroup.value,
                userList: this.state.modalEditGroup.data,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
                if (json.type === 'success') {
                    let activeList = this.state.activeList.slice(0);
                    const group = modalEditGroup.value;
                    activeList[modalEditGroup.index].userList = modalEditGroup.data;
                    activeList[modalEditGroup.index].userNumber = modalEditGroup.data.length;
                    modalEditGroup.show = false;
                    this.setState({
                        modalEditGroup: modalEditGroup,
                        activeList: activeList,
                    })
                } else {
                    modalEditGroup.show = false;
                    this.setState({
                        modalEditGroup: modalEditGroup,
                    })
                }
            })
    }
    //group add group
    modalAddGroup = () => {
        let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
        modalAddGroup.show = true;
        this.setState({
            modalAddGroup
        })
    }
    addGroupOnchangeGroupname = (e) => {
        let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
        let activeList = this.state.activeList;

        modalAddGroup.groupName = e.target.value;
        for (let i = 0; i < activeList.length; i++) {
            if (activeList[i].group !== e.target.value && e.target.value !== '') {
                modalAddGroup.groupNameControl = 'success';
                modalAddGroup.buttonControl = false;
            } else {
                modalAddGroup.groupNameControl = 'error';
                modalAddGroup.buttonControl = true;
                break;
            }
        }
        this.setState({ modalAddGroup })
    }
    addGroupOnchangeDescription = (e) => {
        let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
        modalAddGroup.description = e.target.value;
        this.setState({ modalAddGroup })
    }
    addGroupOnchangeUser = (e) => {
        let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
        const temp = e.map((item) => item.value)
        modalAddGroup.data = temp;
        this.setState({ modalAddGroup })
    }
    addGroupOver = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/group/addGroup', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({
                type: 'group',
                groupName: this.state.modalAddGroup.groupName,
                description: this.state.modalAddGroup.description,
                userList: this.state.modalAddGroup.data,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
                if (json.type === 'success') {
                    let activeList = this.state.activeList.slice(0);
                    const temp = {
                        type: 'group',
                        group: modalAddGroup.groupName,
                        description: modalAddGroup.description,
                        userNumber: modalAddGroup.data.length,
                        userList: modalAddGroup.data,
                    }
                    activeList.unshift(temp);
                    modalAddGroup = {
                        buttonControl: true,
                        groupNameControl: 'error',
                        show: false,
                        groupName: '',
                        description: '',
                        data: [],
                    }
                    this.setState({
                        modalAddGroup: modalAddGroup,
                        activeList: activeList,
                    })
                } else {
                    modalAddGroup.show = false;
                    this.setState({
                        modalAddGroup: modalAddGroup,
                    })
                }
            })
    }

    //user delete user
    modalDeleteUser = (cellInfo) => {
        let modalDelete = Object.assign({}, this.state.modalDelete);

        modalDelete.show = true;
        modalDelete.type = 'user';
        modalDelete.value = cellInfo.original.user;
        modalDelete.index = cellInfo.index;
        this.setState({
            modalDelete
        })
    }
    deleteUserOver = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/user/deleteUser', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({
                type: this.state.modalDelete.type,
                userName: this.state.modalDelete.value,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let modalDelete = Object.assign({}, this.state.modalDelete);
                if (json.type === 'success') {
                    let activeList = this.state.activeList.slice(0);
                    activeList.splice(modalDelete.index, 1);
                    modalDelete.show = false;
                    this.setState({
                        modalDelete: modalDelete,
                        activeList: activeList,
                    })
                } else {
                    modalDelete.show = false;
                    this.setState({
                        modalDelete: modalDelete,
                    })
                }
            })
    }
    //user edit group
    modalEditUser = (cellInfo) => {
        let modalEditUser = Object.assign({}, this.state.modalEditUser);
        modalEditUser.show = true;
        modalEditUser.type = 'user';
        modalEditUser.value = cellInfo.original.user;
        modalEditUser.data = cellInfo.original.groupList.split(',');
        modalEditUser.index = cellInfo.index;
        this.setState({
            modalEditUser
        })
    }
    editUserOnchange = (e) => {
        let modalEditUser = Object.assign({}, this.state.modalEditUser);
        const temp = e.map((item) => item.value)
        modalEditUser.data = temp;
        this.setState({ modalEditUser })
    }
    editUserOver = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/user/editGroupList', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({
                type: 'user',
                userName: this.state.modalEditUser.value,
                groupList: this.state.modalEditUser.data,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let modalEditUser = Object.assign({}, this.state.modalEditUser);
                if (json.type === 'success') {
                    let activeList = this.state.activeList.slice(0);
                    const group = modalEditUser.value;
                    activeList[modalEditUser.index].groupList = modalEditUser.data;
                    activeList[modalEditUser.index].groupNumber = modalEditUser.data.length;
                    modalEditUser.show = false;
                    this.setState({
                        modalEditUser: modalEditUser,
                        activeList: activeList,
                    })
                } else {
                    modalEditUser.show = false;
                    this.setState({
                        modalEditUser: modalEditUser,
                    })
                }
            })
    }
    //user add user
    modalAddUser = () => {
        let modalAddUser = Object.assign({}, this.state.modalAddUser);
        modalAddUser.show = true;
        this.setState({
            modalAddUser
        })
    }
    addUserOnchangeUsername = (e) => {
        let modalAddUser = Object.assign({}, this.state.modalAddUser);
        let activeList = this.state.activeList;

        modalAddUser.userName = e.target.value;
        for (let i = 0; i < activeList.length; i++) {
            // console.log(activeList[i])
            if (activeList[i].user !== e.target.value && e.target.value !== '') {
                modalAddUser.groupNameControl = 'success';
                modalAddUser.buttonControl = false;
            } else {
                modalAddUser.groupNameControl = 'error';
                modalAddUser.buttonControl = true;
                break;
            }
        }
        this.setState({ modalAddUser })
    }
    addUserOnchangeGroup = (e) => {
        let modalAddUser = Object.assign({}, this.state.modalAddUser);
        const temp = e.map((item) => item.value)
        modalAddUser.data = temp;
        this.setState({ modalAddUser })
    }
    addUserOver = () => {
        fetch('http://bigdata-view.cootekservice.com:50056/authority/user/addUser', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },

            body: JSON.stringify({
                type: 'group',
                userName: this.state.modalAddUser.userName,
                groupList: this.state.modalAddUser.data,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let modalAddUser = Object.assign({}, this.state.modalAddUser);
                if (json.type === 'success') {
                    let activeList = this.state.activeList.slice(0);
                    const temp = {
                        type: 'user',
                        user: modalAddUser.userName,
                        groupNumber: modalAddUser.data.length,
                        groupList: modalAddUser.data,
                    }
                    activeList.unshift(temp);
                    modalAddUser = {
                        buttonControl: true,
                        groupNameControl: 'error',
                        show: false,
                        userName: '',
                        data: [],
                    }
                    this.setState({
                        modalAddUser: modalAddUser,
                        activeList: activeList,
                    })
                } else {
                    modalAddUser.show = false;
                    this.setState({
                        modalAddUser: modalAddUser,
                    })
                }
            })
    }
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
                        {this.state.modalDelete.type === 'group'
                            ? <Button bsStyle="primary" onClick={this.deleteGroupOver}>Delete</Button>
                            : <Button bsStyle="primary" onClick={this.deleteUserOver}>Delete</Button>}

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
                        <Panel header="Users">

                            <FormGroup >

                                <Select
                                    name="form-field-name"
                                    multi
                                    onChange={(e) => this.editGroupOnchange(e)}
                                    value={this.state.modalEditGroup.data}
                                    options={this.state.optionsUser}
                                />
                            </FormGroup>
                        </Panel>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Cannel</Button>
                        <Button bsStyle="primary" onClick={this.editGroupOver}>Edit</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
        let renderModalEditUser = () => {
            return (
                <Modal
                    show={this.state.modalEditUser.show}
                    onHide={this.close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit the <span className='strong'>{this.state.modalEditUser.value}</span>({this.state.modalEditUser.type}) </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Panel header="Users">
                            <FormGroup >
                                <Select
                                    name="form-field-name"
                                    multi
                                    onChange={(e) => this.editUserOnchange(e)}
                                    value={this.state.modalEditUser.data}
                                    options={this.state.optionsGroup}
                                />
                            </FormGroup>
                        </Panel>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Cannel</Button>
                        <Button bsStyle="primary" onClick={this.editUserOver}>Edit</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
        let renderModalAddGroup = () => {
            return (
                <Modal
                    show={this.state.modalAddGroup.show}
                    onHide={this.close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add the <span className='strong'>Group</span></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Panel header="Group">
                            <FormGroup validationState={this.state.modalAddGroup.groupNameControl}>
                                <InputGroup>
                                    <InputGroup.Addon>Group name</InputGroup.Addon>
                                    <FormControl type="text" placeholder='group name' value={this.state.modalAddGroup.groupName}
                                        onChange={(e) => this.addGroupOnchangeGroupname(e)} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroup.Addon>Description</InputGroup.Addon>
                                    <FormControl type="text" placeholder='description' value={this.state.modalAddGroup.description}
                                        onChange={(e) => this.addGroupOnchangeDescription(e)} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroup.Addon>Users</InputGroup.Addon>
                                    <Select
                                        name="form-field-name"
                                        multi
                                        onChange={(e) => this.addGroupOnchangeUser(e)}
                                        value={this.state.modalAddGroup.data}
                                        options={this.state.optionsUser}
                                    />
                                </InputGroup>

                            </FormGroup>


                        </Panel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Cannel</Button>
                        <Button bsStyle="primary" onClick={this.addGroupOver} disabled={this.state.modalAddGroup.buttonControl}>Add</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
        let renderModalAddUser = () => {
            return (
                <Modal
                    show={this.state.modalAddUser.show}
                    onHide={this.close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add the <span className='strong'>User</span></Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Panel header="User">
                            <FormGroup validationState={this.state.modalAddUser.groupNameControl}>
                                <InputGroup>
                                    <InputGroup.Addon>User name</InputGroup.Addon>
                                    <FormControl type="text" placeholder='user name' value={this.state.modalAddUser.userName}
                                        onChange={(e) => this.addUserOnchangeUsername(e)} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroup.Addon>Group</InputGroup.Addon>
                                    <Select
                                        name="form-field-name"
                                        multi
                                        onChange={(e) => this.addUserOnchangeGroup(e)}
                                        value={this.state.modalAddUser.data}
                                        options={this.state.optionsGroup}
                                    />
                                </InputGroup>
                            </FormGroup>
                        </Panel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Cannel</Button>
                        <Button bsStyle="primary" onClick={this.addUserOver} disabled={this.state.modalAddUser.buttonControl}>Add</Button>
                    </Modal.Footer>
                </Modal>
            )
        }

        return (
            <div>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={10}>
                    {this.renderButtonToolbar()}
                    <UserAndGroup
                        userOrGroup={this.state.userOrGroup}
                        data={this.state.activeList}

                        descriptionOnchange={this.descriptionOnchange}
                        modalDeleteGroup={this.modalDeleteGroup}
                        modalEditGroup={this.modalEditGroup}
                        modalAddGroup={this.modalAddGroup}

                        modalDeleteUser={this.modalDeleteUser}
                        modalEditUser={this.modalEditUser}
                        modalAddUser={this.modalAddUser}
                    />
                </Col>

                <Col xsHidden smHidden md={1}></Col>
                {renderModalDelete()}
                {renderModalEditGroup()}
                {renderModalEditUser()}
                {renderModalAddGroup()}
                {renderModalAddUser()}
            </div>
        )
    }
}