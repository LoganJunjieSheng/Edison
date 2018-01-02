import React from 'react';
import { Button, Checkbox, Table } from 'react-bootstrap';

import '../../stylesheets/index.css'

export default class AlarmTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // checkAll: false,
        }
    }

    handleCheck = (id, index) => {
        this.props.checkCheckbox(id, index);
    }
    handleCheckAll = (isCheckAll) => {
        this.props.checkAll(this.props.isCheckAll);
    }
    handleAck = (data, index) => {
        this.props.ack(data, index);
    }
    handleAckAll = () => {
        this.props.ackAll();
    }
    handleRatio = (data) => {
        this.props.ratio(data);
    }
    render() {
        const dataList = this.props.dataList;
        let datas = [];
        dataList.map((data, index) => {
            let checked = data.checked ? 'checked' : "";
            let radio = data.hasRatio ? <Button bsSize="xsmall" onClick={() => this.handleRatio(data)} >ratio</Button> : '';
            datas.push(
                <tr key={index} className={checked}>
                    <td>
                        {/* <Checkbox
                            inline
                            checked={data.checked}
                            onClick={() => this.handleCheck(data.id, index)}
                        > */}
                            {index + 1}
                        {/* </Checkbox> */}
                    </td>
                    <td>{data.type}</td>
                    <td>{data.server}</td>
                    <td>{data.description}</td>
                    <td>{data.time.substring(0, 19)}</td>
                    <td>{data.status}</td>
                    <td>
                        <Button bsSize="xsmall" className='btn-mb10'
                            onClick={() => this.handleAck(data, index)}>ack</Button>
                        {radio}
                    </td>
                </tr>
            )
        })
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>
                            {/* <Checkbox
                            inline
                            checked={this.state.checkAll}
                            onClick={this.handleCheckAll}
                        > */}
                         #
                         {/* </Checkbox> */}
                         </th>
                        <th>Type</th>
                        <th>Server</th>
                        <th>Description</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th> 
                            {/* <Button bsSize="xsmall"
                            onClick={this.handleAckAll}>ACK ALL</Button> */}
                            Action  
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {datas}
                </tbody>
            </Table>
        )
    }
}