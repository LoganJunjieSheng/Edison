import React from 'react';
import { Button, Col } from 'react-bootstrap';
import ModalPop from './components/modalPop'
import HistoryTable from './components/historyTable'
import fetch from 'node-fetch';

import '../stylesheets/index.css'
import '../stylesheets/operationAndMaintenance.css'

export default class Operation extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalId: '',
            modalShow: false,
            modalTitle: '',
            modalBody: '',
            modalDo: '',
        }
    }

    closeModal = () => {
        this.setState({
            modalShow: false
        })
    }


    showModalDrill = (e) => {
        const value = e.target.value;
        let valueArray = value.split('-');
        // let operation = valueArray[0];
        // let server = valueArray[1];
        let option = valueArray[2];
        this.setState({
            modalId: value,
            modalShow: true,
            modalTitle: <div>Restart drill in <span className='strong'>{option}</span></div>,
            modalBody: <div>Are you sure that you want to restart the drill in <span className='strong'>{option}</span> ?</div>,
            modalDo: 'Restart',
        })
    }

    showModalDruid = (e) => {
        const value = e.target.value;
        let valueArray = value.split('-');
        // let operation = valueArray[0];
        // let server = valueArray[1];
        let option = valueArray[2];
        this.setState({
            modalId: value,
            modalShow: true,
            modalTitle: 'Switch druid to ' + option,
            modalBody: 'Are you sure that you want to switch the druid to ' + option + '?',
            modalDo: 'Switch',
        })
    }

    showModalRainbow = (e) => {
        const value = e.target.value;
        let valueArray = value.split('-');
        // let operation = valueArray[0];
        // let server = valueArray[1];
        // let option = valueArray[2];
        this.setState({
            modalId: value,
            modalShow: true,
            modalTitle: 'Restart rainbow2.0 ',
            modalBody: 'Are you sure that you want to restart the rainbow2.0 ?',
            modalDo: 'Restart',
        })
    }

    postValue = (id) => {
        let idArray = id.split('-');
        let operation = idArray[0];
        let server = idArray[1];
        let option = idArray[2];
        console.log("operation : " + operation + ' / server : ' + server + ' / option : ' + option)

        fetch('http://localhost:4000/operationAndMaintenanceTools/drill/restart', {
            method: "POST",
            mode: "cors",
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded'
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation: operation,
                server: server,
                option: option
            })
        })
            .then(res => res.json())
            .then(json => console.log(json));
    }

    render() {
        const historyTableHead = ['Server', 'Option', 'Operation', 'Time', 'Result'];
        const historuTableBody = [
            ['id1', 'Drill', 'China', 'Restart', '2017/12/21/18:56', 'success'],
            ['id2', 'Drill', 'Usa', 'Restart', '2017/12/21/18:59', 'Defeat'],
        ];
        return (
            <div>
                <Col xsHidden smHidden md={2}></Col>
                <Col xs={12} sm={12} md={3}>
                    <div className="page-item">
                        <div className='page-title' >Restart Drill</div>
                        <Button bsClass='btn btn-default btn-mr20' bsSize="large" value='restart-drill-china'
                            onClick={(e) => this.showModalDrill(e)}>CHINA</Button>
                        <Button bsClass='btn btn-default  btn-mr20' bsSize="large" value='restart-drill-usa'
                            onClick={(e) => this.showModalDrill(e)}>USA</Button>
                    </div>

                    <div className="page-item">
                        <div className='page-title' >Switch Druid</div>
                        <Button bsClass='btn btn-default  btn-mr20 btn-mb20' bsSize="large" value='switch-druid-handoop'
                            onClick={(e) => this.showModalDruid(e)}>HANDOOP</Button>
                        <Button bsClass='btn btn-default  btn-mr20 btn-mb20' bsSize="large" value='switch-druid-secondary'
                            onClick={(e) => this.showModalDruid(e)}>SECONDARY</Button>
                    </div>

                    <div className="page-item">
                        <div className='page-title' >Restart Rainbow2.0</div>
                        <Button bsClass='btn btn-default  btn-mr20' bsSize="large" value='restart-rainbow-china'
                            onClick={(e) => this.showModalRainbow(e)}>RESTART</Button>
                    </div>

                    <ModalPop
                        modalId={this.state.modalId}
                        modalShow={this.state.modalShow}
                        modalTitle={this.state.modalTitle}
                        modalBody={this.state.modalBody}
                        modalDo={this.state.modalDo}

                        closeModal={this.closeModal}
                        handleDo={this.postValue}
                    />
                </Col>
                <Col xs={12} sm={12} md={5}>
                    <div className='page-title' >History</div>
                    <HistoryTable
                        thead={historyTableHead}
                        tbody={historuTableBody} />
                </Col>
            </div>
        );
    }
}