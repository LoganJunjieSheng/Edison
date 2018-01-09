import React from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
export default class UserRow extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <tr>
                <td>{this.props.user}</td>
                <td>{this.props.description}</td>
                <td>{this.props.groups}</td>
                <td>
                    <ButtonToolbar>
                        <Button bsSize="xsmall" bsStyle="primary"><Glyphicon glyph="pencil" /></Button>
                        <Button bsSize="xsmall" bsStyle="danger"><Glyphicon glyph="trash" /></Button>
                    </ButtonToolbar>
                </td>

            </tr>
        )
    }
}