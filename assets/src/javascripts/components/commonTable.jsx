import React from 'react';
import { Table, ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import PaginationAdvanced from './paginationAdvanced'
import UserRow from './userRow'
import GroupRow from './groupRow'
export default class CommonTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const renderThead = this.props.thead.map((item, index) =>
            <th key={index}>{item}</th>
        )
        const renderTbody = this.props.data.map((item, index) => {
            if (item.type === 'group') {
                return (<GroupRow
                    key={item.group}
                    type={item.type}
                    group={item.group}
                    description={item.description}
                    users={item.users}

                    Edit={this.props.modalEditGroup}
                    Delete={this.props.deleteRow}
                />)
            }
        })

        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>{renderThead}</tr>
                    </thead>
                    <tbody>
                        {renderTbody}
                    </tbody>
                </Table>
                <PaginationAdvanced
                    items={2}//通过+将string转换为Number
                    maxButtons={5}
                    activePage={1}
                    onSelect={() => { console.log(123) }}
                />
            </div>
        )
    }
}