import React from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import CommonTable from './commonTable'

import '../../stylesheets/index.css'
export default class UserAndGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
   
    render() {
        const userOrGroup = this.props.userOrGroup;
        const data = this.props.data;
        const thead = userOrGroup === 'group' ? ['Group', 'Description', 'Users', 'Action'] : ['User', 'Description', 'Groups', 'Action'];
        const renderCommonTable = () => {
            if (this.props.userOrGroup === 'group') {
                return (
                    <CommonTable
                        thead={thead}
                        data={this.props.data}
                        modalEditGroup={this.props.modalEditGroup}
                        deleteRow={this.props.deleteRow}
                    />
                );
            } else {
                return (
                    <CommonTable
                        thead={thead}
                        data={this.props.data}
                       
                    />
                );
            }

        }

        return (
            <div>
                <div className='page-title'>
                    <span className="btn-mr20">{this.props.userOrGroup === 'user' ? 'User' : 'Group'}</span>
                    <Button bsStyle="primary" onClick={this.props.userOrGroup === 'user' ? this.props.userAddUser : this.props.modalAddGroup} ><Glyphicon glyph="plus" />Add</Button>
                </div>
                {renderCommonTable()}
            </div>
        )
    }
}