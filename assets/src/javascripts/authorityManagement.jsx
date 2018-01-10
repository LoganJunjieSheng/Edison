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
            groupList: [],
            userList: [],
            activeList: [],
            userOrGroup: 'group',
            optionsUser: [
                { label: 'user11', value: 'user11' },
                { label: 'user12', value: 'user12' },
                { label: 'user13', value: 'user13' },
                { label: 'user21', value: 'user21' },
                { label: 'user23', value: 'user22' },
                { label: 'user23', value: 'user23' },
                { label: 'user24', value: 'user24' },
            ],
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
            modalAddGroup: {
                buttonControl: 'true',
                groupNameControl: 'error',
                show: false,
                groupName: '',
                description: '',
                data: [],
            },
        }
    }
    componentDidMount() {
        const group = [
            {
                type: 'group',
                group: 'group1',
                description: 'description1',
                userNumber: 3,
                userList: ['user11', 'user12', 'user13']
            },
            {
                type: 'group',
                group: 'group2',
                description: 'description2',
                userNumber: 4,
                userList: ['user21', 'user22', 'user23', 'user24']
            },
        ];
        const user = [
            {
                type: 'user',
                groups: 'group1',
                description: 'description1',
                user: 'user1',
            },
            {
                type: 'user',
                groups: 'group2',
                description: 'description2',
                user: 'user2',
            },
        ];
        this.setState({
            userOrGroup: 'group',
            groupList: group,
            activeList: group,
        })
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
        let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
        modalAddGroup.show = false;

        this.setState({
            modalDelete: modalDelete,
            modalEditGroup: modalEditGroup,
            modalAddGroup: modalAddGroup,
        })
    }


    descriptionOnchange = (data, cellInfo) => {
        let activeList = this.state.activeList.slice(0);
        activeList[cellInfo.index][cellInfo.column.id] = data;
        this.setState({ activeList });
    }
    //group delete group
    modalDeleteGroup = (cellInfo) => {
        // console.log(type + '_' + value)
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
        let modalDelete = Object.assign({}, this.state.modalDelete);
        let activeList = this.state.activeList.slice(0);
        activeList.splice(modalDelete.index, 1);
        modalDelete.show = false;
        console.log(modalDelete)
        this.setState({
            modalDelete: modalDelete,
            activeList: activeList,
        })
    }
    //group add user
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
        let modalEditGroup = Object.assign({}, this.state.modalEditGroup);
        let activeList = this.state.activeList.slice(0);
        const group = modalEditGroup.value;
        activeList[modalEditGroup.index].userList = modalEditGroup.data;
        modalEditGroup.show = false;
        this.setState({
            modalEditGroup: modalEditGroup,
            activeList: activeList,
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
            console.log(activeList[i])
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
        let modalAddGroup = Object.assign({}, this.state.modalAddGroup);
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
            show: false,
            groupName: '',
            description: '',
            data: [],
        }
        this.setState({
            modalAddGroup: modalAddGroup,
            activeList: activeList,
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
                        <Button bsStyle="primary" onClick={this.deleteGroupOver}>Delete</Button>
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
                            <FormGroup validationState={this.state.modalAddGroup.groupNameControl}>
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

        return (
            <div>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={10}>
                    {this.renderButtonToolbar()}
                    <UserAndGroup
                        userOrGroup={this.state.userOrGroup}
                        data={this.state.activeList}

                        descriptionOnchange={this.descriptionOnchange}
                        modalEditGroup={this.modalEditGroup}
                        modalDeleteGroup={this.modalDeleteGroup}
                        modalAddGroup={this.modalAddGroup}
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