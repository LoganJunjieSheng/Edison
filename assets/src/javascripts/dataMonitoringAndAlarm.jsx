import React from 'react';
import { Col, Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import ModalPop from './components/modalPop'
import SideBar from './components/sideBar'
import AlarmTable from './components/alarmTable'
import PaginationAdvanced from './components/paginationAdvanced'
import fetch from 'node-fetch';
// import * as d3 from "d3";
// import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

import '../stylesheets/index.css'
export default class Alarm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isCheckAll: false,
            activePage: 1,
            pages: '',
            // hasRatio:'',
            // ratioList:[],
            modalId: '',
            modalShow: false,
            modalTitle: '',
            modalBody: '',
            modalDo: '',
            modalControl: "",
        }
    }

    componentDidMount() {

        fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/alarmList', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activePage: 1
            })
        })
            .then(res => res.json())
            .then(json => {
                let temp = [];
                json.alermList.map((item, index) => {
                    temp.push(item);
                    temp[index].checked = false;
                    temp[index].hasRatio = true;
                    temp[index].ratioList = [];
                })

                this.setState({
                    dataList: temp,
                    pages: json.pages,
                })
            });



        // const dataList = [
        //     {
        //         id: 'id0',
        //         hasRatio: true,
        //         checked: false,
        //         type: 'type1',
        //         server: 'server1',
        //         description: 'description1',
        //         time: 'time1',
        //         details: 'details1'
        //     },
        //     {
        //         id: 'id1',
        //         hasRatio: false,
        //         checked: false,
        //         type: 'type2',
        //         server: 'server2',
        //         description: 'description2',
        //         time: 'time2',
        //         details: 'details2'
        //     }
        // ]

        // this.setState({
        //     dataList: dataList,
        // })
    }

    checkCheckbox = (id, index) => {
        let dataList = this.state.dataList.slice();
        dataList[index].checked = !dataList[index].checked;
        this.setState({
            dataList: dataList
        })
    }
    checkAll = (isCheckAll) => {
        let dataList = this.state.dataList.slice();
        if (isCheckAll) {
            dataList.map((item) => {
                item.checked = false;
            })
            this.setState({
                isCheckAll: false
            })
        } else {
            dataList.map((item) => {
                item.checked = true;
            })
            this.setState({
                isCheckAll: true
            })
        }
        this.setState({
            dataList: dataList
        })
    }
    closeModal = () => {
        this.setState({
            modalShow: false
        })
    }
    showModalAck = (data, index) => {
        const modalBody = (
            <div>
                <p>The alarm information is as follows</p>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Server</th>
                            <th>Description</th>
                            <th>Time</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{data.type}</td>
                            <td>{data.server}</td>
                            <td>{data.description}</td>
                            <td>{data.time}</td>
                            <td>{data.details}</td>
                        </tr>
                    </tbody>
                </Table>
                {/* <p>If you want to acknowledge this alarm,please change it's description</p> */}
            </div>
        );
        this.setState({
            modalId: data,
            modalShow: true,
            modalTitle: <div><span className='strong'>Acknowledge</span> the alarm</div>,
            modalBody: modalBody,
            modalDo: 'ACK',
            modalControl: 'ack'
        })
    }
    showModalAckAll = () => {
        let tbody = [];
        let modelId = [];
        this.state.dataList.map((data, index) => {
            if (data.checked) {
                tbody.push(
                    <tr key={index}>
                        <td>{data.type}</td>
                        <td>{data.server}</td>
                        <td>{data.description}</td>
                        <td>{data.time}</td>
                        <td>{data.details}</td>
                    </tr>
                );
                modelId.push(data);
            }
        })

        const modalBody = (
            <div>
                <p>The alarm information is as follows</p>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Server</th>
                            <th>Description</th>
                            <th>Time</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tbody}
                    </tbody>
                </Table>
                {/* <p>If you want to acknowledge this alarm,please change it's description</p> */}
            </div>
        )
        this.setState({
            modalId: modelId,
            modalShow: true,
            modalTitle: <div><span className='strong'>Acknowledge</span> the alarm</div>,
            modalBody: modalBody,
            modalDo: 'ACK All',
            modalControl: 'ack'
        })
    }
    showModalRatio = (data) => {
        const type = data.type;
        fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/ratio', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                table: 'base_count'
            })
        })
            .then(res => res.json())
            .then(json => {
                data.ratioList = json.ratioList;
            });
        console.log(data.ratioList);
        const option = {
            title: {
                text: data.type
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['count', '同比', '环比']
            },
            xAxis: {
                data: ["1", "2", "3", "4", "5", "6"]
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'count',
                   
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: 'ratio',
                   
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
            ],
            series: [
                {
                    name: 'count',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                },
                {
                    name:'同比',
                    type:'line',
                    yAxisIndex:1,
                    data:[10,-10,20,50,-50,200]
                },
                {
                    name:'环比',
                    type:'line',
                    yAxisIndex:1,
                    data:[-10,10,-20,-50,-30,200]
                }
            ]
        };
        const modalBody = (
            <div>
                {/* <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Table</ControlLabel>
                    <FormControl componentClass="select">
                        <option value="select">base_count</option>
                        <option value="other">cor_activate_count</option>
                    </FormControl>
                </FormGroup> */}
                <div>
                    <ReactEcharts
                        option={option}
                        notMerge={true}
                        lazyUpdate={true}
                        theme={"theme_name"}
                    />
                </div>

            </div>
        );
        this.setState({
            modalId: data,
            modalShow: true,
            modalTitle: <div><span className='strong'>MoM</span> and <span className='strong'>YoY</span> of the alarm</div>,
            modalBody: modalBody,
            modalDo: 'Ok',
            modalControl: 'ratio'
        })
    }
    handleSelect = (eventKey) => {
        this.setState({
            activePage: eventKey
        });
        fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/alarmList', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activePage: eventKey
            })
        })
            .then(res => res.json())
            .then(json => {
                let temp = [];
                json.alermList.map((item, index) => {
                    temp.push(item);
                    temp[index].checked = false;
                    temp[index].hasRatio = true;
                    temp[index].ratioList = [];
                })

                this.setState({
                    dataList: temp,
                    pages: json.pages,
                })
            });
    }
    ack = (id) => {
        //     fetch('http://localhost:4000/ack', {
        //         method: "POST",
        //         mode: "cors",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             operation: operation,
        //             server: server,
        //             option: option
        //         })
        //     })
        //         .then(res => res.json())
        //         .then(json => console.log(json));
        // }
    }
    ratio = (id) => {
        // const type = id.type;
        // fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/ratio', {
        //     method: "POST",
        //     mode: "cors",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         type: type,
        //         table: 'base_count'
        //     })
        // })
        //     .then(res => res.json())
        //     .then(json => {
        //         this.setState({
        //             ratioList: json.ratioList
        //         })
        //     });
    }

    render() {
        const siderBarList = ['All', "Today", "yesterday", "The last three days", 'This week'];

        return (
            <div>
                <Col xsHidden smHidden md={12}><div className="placeholder-h30"></div></Col>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={3}>
                    <div className='page-title'>Filter Table</div>
                    <SideBar itemList={siderBarList} />
                </Col>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={6}>
                    <div className='page-title'>Alarm Table</div>
                    <AlarmTable
                        dataList={this.state.dataList}
                        isCheckAll={this.state.isCheckAll}

                        checkCheckbox={this.checkCheckbox}
                        checkAll={this.checkAll}
                        ack={this.showModalAck}
                        ackAll={this.showModalAckAll}
                        ratio={this.showModalRatio}
                    />
                    <PaginationAdvanced
                        items={this.state.pages}
                        maxButtons={5}
                        activePage={this.state.activePage}
                        onSelect={this.handleSelect}
                    />
                </Col>
                <ModalPop
                    modalId={this.state.modalId}
                    modalShow={this.state.modalShow}
                    modalTitle={this.state.modalTitle}
                    modalBody={this.state.modalBody}
                    modalDo={this.state.modalDo}

                    closeModal={this.closeModal}
                    handleDo={this.state.modalControl === 'ack' ? this.ack : this.ratio}
                />
            </div>
        )
    }
}