import React from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
export default class GroupRow extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    handleEdit = (type, group) => {
        this.props.Edit(type, group);
    }

    handleDelete = (type, group) => {
        this.props.Delete(type, group);
    }
    render() {
        return (
            <tr>
                <td>{this.props.group}</td>
                <td>{this.props.description}</td>
                <td>{this.props.users}</td>
                <td>
                    <ButtonToolbar>
                        <Button bsSize="xsmall" bsStyle="primary" onClick={() => this.handleEdit(this.props.type, this.props.group)}><Glyphicon glyph="pencil" /></Button>
                        <Button bsSize="xsmall" bsStyle="danger" onClick={() => this.handleDelete(this.props.type, this.props.group)}><Glyphicon glyph="trash" /></Button>
                    </ButtonToolbar>
                </td>

            </tr>
        )
    }
}