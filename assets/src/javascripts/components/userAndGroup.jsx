import React from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";
import '../../stylesheets/index.css'
export default class UserAndGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // data: [
            //     {
            //         group: 'group1',
            //         description: 'description1',
            //         userNumber: 3,
            //         userList: ['user1', 'user2', 'user3', 'user4'].toString(),
            //     },
            //     {
            //         group: 'group2',
            //         description: 'description1',
            //         userNumber: 3,
            //         userList: ['user1', 'user2', 'user3'].toString(),
            //     },
            // ]
        }
    }
    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.props.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.props.descriptionOnchange(e.target.innerHTML, cellInfo);
                }}
                dangerouslySetInnerHTML={{
                    __html: this.props.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }
    renderAction = (cellInfo) => {
        return (
            <ButtonToolbar>
                <Button bsSize="xsmall" bsStyle="primary" onClick={e => { this.props.modalEditGroup(cellInfo) }}><Glyphicon glyph="pencil" /></Button>
                <Button bsSize="xsmall" bsStyle="danger" onClick={e => { this.props.modalDeleteGroup(cellInfo) }}><Glyphicon glyph="trash" /></Button>
            </ButtonToolbar>
        )
    }
    render() {
        const userOrGroup = this.props.userOrGroup;
        const renderTable = () => {
            if (this.props.userOrGroup === 'group') {
                const data = this.props.data.map((item) => {
                    let temp = Object.assign({}, item);
                    temp.userList = item.userList.toString();
                    return temp;
                });
                return (
                    <ReactTable
                        data={data}
                        columns={[
                            {
                                Header: "Group",
                                columns: [
                                    {
                                        Header: "Group Name",
                                        accessor: "group",
                                        filterable:true,
                                    },
                                    {
                                        Header: "Group description",
                                        accessor: "description",
                                        Cell: this.renderEditable,
                                        filterable:true,
                                    }
                                ]
                            },
                            {
                                Header: "User",
                                columns: [
                                    {
                                        Header: "User number",
                                        accessor: "userNumber",
                                        filterable:true,
                                    },
                                    {
                                        Header: "Users",
                                        accessor: "userList",
                                        filterable:true,
                                    }
                                ]
                            },
                            {
                                Header: "Action",
                                columns: [
                                    {
                                        Header: "Action",
                                        Cell: this.renderAction,
                                        
                                    },
                                ]
                            },

                        ]}
                        defaultPageSize={10}
                        className="-striped -highlight"
                        
                    />
                );
            } else {
                // return (
                //     <CommonTable
                //         thead={thead}
                //         data={this.props.data}
                //         modalEditGroup={this.props.modalEditGroup}
                //         deleteRow={this.props.deleteRow}
                //     />
                // );
            }

        }

        return (
            <div>
                <div className='page-title'>
                    <span className="btn-mr20">{this.props.userOrGroup === 'user' ? 'User' : 'Group'}</span>
                    <Button bsStyle="primary" onClick={this.props.userOrGroup === 'user' ? this.props.userAddUser : this.props.modalAddGroup} ><Glyphicon glyph="plus" />Add</Button>
                </div>
                {renderTable()}
            </div>
        )
    }
}