import React from 'react';
import { Table } from 'react-bootstrap';


export default class HistoryTable extends React.PureComponent {

    render() {
        const thead = this.props.thead;
        const tbody = this.props.tbody;
        let theadList = [];
        let tbodyList = [];
        thead.map((item, index) => {
            theadList.push(
                <th key={index}>{item}</th>
            )
        })
        tbody.map((item, index) => {
            let temp = [];
            item.map((itemChild, indexChild) => {
                if (indexChild === 0) {
                    temp.push(<td key={indexChild}>{index + 1}</td>)
                } else {
                    temp.push(<td key={indexChild}>{itemChild}</td>)
                }
            })
            tbodyList.push(<tr key={index}>{temp}</tr>)
        })

        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        {theadList}
                    </tr>
                </thead>
                <tbody>
                    {tbodyList}
                </tbody>
            </Table>
        )
    }
}