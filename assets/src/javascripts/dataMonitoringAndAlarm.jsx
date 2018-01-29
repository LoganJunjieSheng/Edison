import React from 'react';
import { Col, Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import ModalPop from './components/modalPop'
import SideBar from './components/sideBar'
import AlarmTable from './components/alarmTable'
import PaginationAdvanced from './components/paginationAdvanced'
import fetch from 'node-fetch';
import ReactEcharts from 'echarts-for-react';

import '../stylesheets/index.css'
export default class Alarm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],//数据集合
            isCheckAll: false,//全选按钮状态
            activePage: 1,//当前页数，默认为1
            pages: '',//总页数

            // modalId: '',
            modalShow: false,
            // modalTitle: '',
            // modalBody: '',
            // modalDo: '',
            // modalControl: "",

            ackDescription: 'ok',
            ackActive: {
                type: '',
                server: '',
                description: '',
                time: '',
                status: '',
            },
            echartsOption: {},//echarts对象的option
        }
    }

    componentDidMount() {
        //post alarmList获取dataList，pages
        fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/alarmList', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,

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
                    if (temp[index].status) {
                        temp[index].checked = true;
                    } else {
                        temp[index].checked = false;
                    }

                    temp[index].ratioList = [];
                })

                this.setState({
                    dataList: temp,
                    pages: json.pages,
                })
                console.log(temp)
            })
            .catch((ex) => { console.log(ex); })
    }
    //处理多选框事件
    checkCheckbox = (id, index) => {
        let dataList = this.state.dataList.slice();
        dataList[index].checked = !dataList[index].checked;
        this.setState({
            dataList: dataList
        })
    }
    //处理全选框事件，无需求，暂时保留
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
    //处理弹出框点击右上角×事件
    closeModal = () => {
        this.setState({
            modalShow: false
        })
    }
    //点击ack事件，将弹框显示出来
    showModalAck = (data, index) => {
        this.setState({
            modalShow: true,
            ackActive: data,
        })
    }
    //点击ackAll事件，将弹框显示出来,无需求，暂时保留
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
    //点击ratio事件，获取按照点击的type获取数据，用Echarts渲染数据
    showRatio = (data) => {
        const type = data.type;
        const table = data.hasRatio;//数据库data_type_map中type对应的表名
        fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/ratio', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },
            body: JSON.stringify({
                type: type,
                table: table,
            })
        })
            .then(res => res.json())
            .then(json => {
                data.ratioList = json.ratioList;
            })
            .then(() => {
                let legend = {}
                let series = [];
                let date = [];

                switch (data.hasRatio) {
                    case "base_count":
                    case 'cor_activate_count':
                    case 'rowkey_count':
                    case 'usage_count':
                        legend = {
                            data: ['count', 'day of day', 'month of month'],
                            selected: {
                                'count': false,
                            }
                        };
                        let current = [];
                        let dod = [];
                        let mom = [];
                        data.ratioList.map((item, index) => {
                            console.log(item);
                            current.push(item.current);
                            date.push(item.date.substring(0, 19));
                            dod.push((item.current - item.last_day) / item.last_day * 100);
                            mom.push((item.current - item.last_month) / item.last_month * 100);
                        });
                        series = [
                            {
                                name: 'count',
                                type: 'line',
                                data: current,
                                yAxisIndex: 1,
                                smooth: true,
                            },
                            {
                                name: 'day of day',
                                type: 'line',
                                data: dod,
                                smooth: true,
                            },
                            {
                                name: 'month of month',
                                type: 'line',
                                data: mom,
                                smooth: true,
                            },
                        ];
                        break;
                    case 'summary_count':
                        legend = {
                            data: ['count', 'day of day', 'month of month'],
                            selected: {
                                'count': false
                            }
                        };
                        let current_check = [];
                        let dod_check = [];
                        let mom_check = [];
                        data.ratioList.map((item, index) => {
                            console.log(item)
                            current_check.push(item.current);
                            date.push(item.date.substring(0, 19));
                            dod_check.push((item.current - item.last_check) / item.last_check * 100);
                            mom_check.push((item.current - item.month_check) / item.month_check * 100);
                            series = [
                                {
                                    name: 'count',
                                    type: 'line',
                                    data: current_check,
                                    yAxisIndex: 1,
                                    smooth: true,
                                },
                                {
                                    name: 'day of day',
                                    type: 'line',
                                    data: dod_check,
                                    smooth: true,
                                },
                                {
                                    name: 'month of month',
                                    type: 'line',
                                    data: mom_check,
                                    smooth: true,
                                },
                            ];
                        });
                        break;
                    case 'ad_news_count':
                        let current_click = [];
                        let current_shown = [];
                        let dod_shown = [];
                        let dod_click = [];
                        let mom_shown = [];
                        let mom_click = [];
                        legend = {
                            data: [
                                'count(shown)',
                                'day of day(shown)', 'month of month(shown)',
                                'count(click)',
                                'day of day(click)', 'month of month(click)',
                            ],
                            selected: {
                                'count(shown)': false,
                                'count(click)': false,
                                'day of day(click)': false,
                                'month of month(click)': false,
                            }
                        };
                        data.ratioList.map((item, index) => {
                            console.log(item)
                            current_click.push(item.click_current);
                            current_shown.push(item.shown_current);

                            date.push(item.date.substring(0, 19));

                            dod_shown.push((item.shown_current - item.shown_last_day) / item.shown_last_day * 100);
                            dod_click.push((item.click_current - item.click_last_day) / item.click_last_day * 100);

                            mom_shown.push((item.shown_current - item.shown_last_month) / item.shown_last_month * 100);
                            mom_click.push((item.click_current - item.click_last_month) / item.click_last_month * 100);
                        });
                        series = [
                            {
                                name: 'count(shown)',
                                type: 'line',
                                data: current_shown,
                                yAxisIndex: 1,
                                smooth: true,
                            },
                            {
                                name: 'day of day(shown)',
                                type: 'line',
                                // yAxisIndex: 1,
                                data: dod_shown,
                                smooth: true,
                            },
                            {
                                name: 'month of month(shown)',
                                type: 'line',
                                // yAxisIndex: 1,
                                data: mom_shown,
                                smooth: true,
                            },
                            {
                                name: 'count(click)',
                                type: 'line',
                                data: current_click,
                                yAxisIndex: 1,
                                smooth: true,
                            },
                            {
                                name: 'day of day(click)',
                                type: 'line',
                                data: dod_click,
                                smooth: true,
                            },
                            {
                                name: 'month of month(click)',
                                type: 'line',
                                data: mom_click,
                                smooth: true,
                            },
                        ];
                        break;
                    case 'daily_revenue_count':
                        console.log(data.ratioList)
                        let current_active = [];
                        let current_active_launch = [];
                        let current_feeds_revenus = [];
                        let current_hangup_revenus = [];
                        let current_other_revenus = [];
                        let current_red_revenus = [];

                        let dod_active = [];
                        let dod_active_launch = [];
                        let dod_feeds_revenus = [];
                        let dod_hangup_revenus = [];
                        let dod_other_revenus = [];
                        let dod_red_revenus = [];

                        let mom_active = [];
                        let mom_active_launch = [];
                        let mom_feeds_revenus = [];
                        let mom_hangup_revenus = [];
                        let mom_other_revenus = [];
                        let mom_red_revenus = [];
                        legend = {
                            data: [
                                'count(active)', 'day of day(active)', 'month of month(active)',
                                'count(active_launch)', 'day of day(active_launch)', 'month of month(active_launch)',
                                'count(feeds_revenus)', 'day of day(feeds_revenus)', 'month of month(feeds_revenus)',
                                'count(hangup_revenus)', 'day of day(hangup_revenus)', 'month of month(hangup_revenus)',
                                'count(other_revenus)', 'day of day(other_revenus)', 'month of month(other_revenus)',
                                'count(red_revenus)', 'day of day(red_revenus)', 'month of month(red_revenus)',
                            ],
                            selected: {
                                // 'count(active)':false,
                                'count(active_launch)': false,
                                'day of day(active_launch)': false,
                                'month of month(active_launch)': false,
                                'count(feeds_revenus)': false,
                                'day of day(feeds_revenus)': false,
                                'month of month(feeds_revenus)': false,
                                'count(hangup_revenus)': false,
                                'day of day(hangup_revenus)': false,
                                'month of month(hangup_revenus)': false,
                                'count(other_revenus)': false,
                                'day of day(other_revenus)': false,
                                'month of month(other_revenus)': false,
                                'count(red_revenus)': false,
                                'day of day(red_revenus)': false,
                                'month of month(red_revenus)': false,

                            },
                            type: 'scroll',
                            right: '15%',
                            left: '20%',
                        };
                        data.ratioList.map((item, index) => {
                            console.log(item)
                            current_active.push(item.active_current);
                            current_active_launch.push(item.launch_active_current);
                            current_feeds_revenus.push(item.feeds_revenue_current);
                            current_hangup_revenus.push(item.hangup_revenue_current);
                            current_other_revenus.push(item.other_revenue_current);
                            current_red_revenus.push(item.red_revenue_current);

                            date.push(item.date.substring(0, 19));

                            dod_active.push((item.active_current - item.active_last_day) / item.active_last_day * 100);
                            dod_active_launch.push((item.launch_active_current - item.launch_active_last_day) / item.launch_active_last_day * 100);
                            dod_feeds_revenus.push((item.feeds_revenue_current - item.feeds_revenue_last_day) / item.feeds_revenue_last_day * 100);
                            dod_hangup_revenus.push((item.hangup_revenue_current - item.hangup_revenue_last_day) / item.hangup_revenue_last_day * 100);
                            dod_other_revenus.push((item.other_revenue_current - item.other_revenue_last_day) / item.other_revenue_last_day * 100);
                            dod_red_revenus.push((item.red_revenue_current - item.red_revenue_last_day) / item.red_revenue_last_day * 100);

                            mom_active.push((item.active_current - item.active_last_month) / item.active_last_month * 100);
                            mom_active_launch.push((item.launch_active_current - item.launch_active_last_month) / item.launch_active_last_month * 100);
                            mom_feeds_revenus.push((item.feeds_revenue_current - item.feeds_revenue_last_month) / item.feeds_revenue_last_month * 100);
                            mom_hangup_revenus.push((item.hangup_revenue_current - item.hangup_revenue_last_month) / item.hangup_revenue_last_month * 100);
                            mom_other_revenus.push((item.other_revenue_current - item.other_revenue_last_month) / item.other_revenue_last_month * 100);
                            mom_red_revenus.push((item.red_revenue_current - item.red_revenue_last_month) / item.red_revenue_last_month * 100);
                        });
                        series =
                            [
                                {
                                    name: 'count(active)',
                                    type: 'line',
                                    data: current_active,
                                    yAxisIndex: 1,
                                    smooth: true,
                                },
                                {
                                    name: 'day of day(active)',
                                    type: 'line',
                                    // yAxisIndex: 1,
                                    data: dod_active,
                                    smooth: true,
                                },
                                {
                                    name: 'month of month(active)',
                                    type: 'line',
                                    // yAxisIndex: 1,
                                    data: mom_active,
                                    smooth: true,
                                },

                                {
                                    name: 'count(active_launch)',
                                    type: 'line',
                                    data: current_active_launch,
                                    yAxisIndex: 1,
                                    smooth: true,
                                },
                                {
                                    name: 'day of day(active_launch)',
                                    type: 'line',
                                    data: dod_active_launch,
                                    smooth: true,
                                },
                                {
                                    name: 'month of month(active_launch)',
                                    type: 'line',
                                    data: mom_active_launch,
                                    smooth: true,
                                },

                                {
                                    name: 'count(feeds_revenus)',
                                    type: 'line',
                                    data: current_feeds_revenus,
                                    yAxisIndex: 1,
                                    smooth: true,
                                },
                                {
                                    name: 'day of day(feeds_revenus)',
                                    type: 'line',
                                    data: dod_feeds_revenus,
                                    smooth: true,
                                },
                                {
                                    name: 'month of month(feeds_revenus)',
                                    type: 'line',
                                    data: mom_feeds_revenus,
                                    smooth: true,
                                },

                                {
                                    name: 'count(hangup_revenus)',
                                    type: 'line',
                                    data: current_hangup_revenus,
                                    yAxisIndex: 1,
                                    smooth: true,
                                },
                                {
                                    name: 'day of day(hangup_revenus)',
                                    type: 'line',
                                    data: dod_hangup_revenus,
                                    smooth: true,
                                },
                                {
                                    name: 'month of month(hangup_revenus)',
                                    type: 'line',
                                    data: mom_hangup_revenus,
                                    smooth: true,
                                },

                                {
                                    name: 'count(other_revenus)',
                                    type: 'line',
                                    data: current_other_revenus,
                                    yAxisIndex: 1,
                                    smooth: true,
                                },
                                {
                                    name: 'day of day(other_revenus)',
                                    type: 'line',
                                    data: dod_other_revenus,
                                    smooth: true,
                                },
                                {
                                    name: 'month of month(other_revenus)',
                                    type: 'line',
                                    data: mom_other_revenus,
                                    smooth: true,
                                },

                                {
                                    name: 'count(red_revenus)',
                                    type: 'line',
                                    data: current_red_revenus,
                                    yAxisIndex: 1,
                                    smooth: true,
                                },
                                {
                                    name: 'day of day(red_revenus)',
                                    type: 'line',
                                    data: dod_red_revenus,
                                    smooth: true,
                                },
                                {
                                    name: 'month of month(red_revenus)',
                                    type: 'line',
                                    data: mom_red_revenus,
                                    smooth: true,
                                },
                            ];
                        break;
                    case 'retention_count':
                        legend = {
                            data: ['activate',
                                'retention rate(2 days)',
                                'retention rate(3 days)',
                                'retention rate(7 days)',
                                'retention rate(14 days)',
                                'retention rate(30 days)',
                                'retention rate(60 days)'],
                            selected: {
                                'activate': false,
                            }
                        };
                        let activate = [];
                        let day2 = [];
                        let day3 = [];
                        let day7 = [];
                        let day14 = [];
                        let day30 = [];
                        let day60 = [];
                        data.ratioList.map((item, index) => {
                            activate.push(item.activate);
                            date.push(item.date.substring(0, 19));
                            day2.push(item.retention_2 / item.activate * 100);
                            day3.push(item.retention_3 / item.activate * 100);
                            day7.push(item.retention_7 / item.activate * 100);
                            day14.push(item.retention_14 / item.activate * 100);
                            day30.push(item.retention_30 / item.activate * 100);
                            day60.push(item.retention_60 / item.activate * 100);
                            console.log(item)
                        });

                        series = [
                            {
                                name: 'activate',
                                type: 'line',
                                data: activate,
                                yAxisIndex: 1,
                                smooth: true,
                            },
                            {
                                name: 'retention rate(2 days)',
                                type: 'line',
                                data: day2,
                                smooth: true,
                            },
                            {
                                name: 'retention rate(3 days)',
                                type: 'line',
                                data: day3,
                                smooth: true,
                            },
                            {
                                name: 'retention rate(7 days)',
                                type: 'line',
                                data: day7,
                                smooth: true,
                            },
                            {
                                name: 'retention rate(14 days)',
                                type: 'line',
                                data: day14,
                                smooth: true,
                            },
                            {
                                name: 'retention rate(30 days)',
                                type: 'line',
                                data: day30,
                                smooth: true,
                            },
                            {
                                name: 'retention rate(60 days)',
                                type: 'line',
                                data: day60,
                                smooth: true,
                            },
                        ];
                    default:

                }

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
                            // magicType: { show: true, type: ['line', 'line'] },
                            // restore: { show: true },
                            saveAsImage: { show: true },

                        },
                        right: '10%',
                    },
                    legend: legend,
                    xAxis: {
                        data: date,
                        type: 'category',
                        boundaryGap: true,
                    },
                    yAxis: [

                        {
                            type: 'value',
                            name: 'ratio',
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        },
                        {
                            type: 'value',
                            name: 'count',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                    ],
                    dataZoom: [
                        {
                            type: 'inside',
                            start: 90,
                            end: 100,
                        },
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            start: 0,
                            end: 100,
                        },
                    ],
                    series: series
                };
                this.setState({
                    echartsOption: option
                })
            })
    }
    //分页点击事件，调用数据库
    handleSelect = (eventKey) => {
        this.setState({
            activePage: eventKey
        });
        fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/alarmList', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
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
                    if (temp[index].status) {
                        temp[index].checked = true;
                    } else {
                        temp[index].checked = false;
                    }

                    temp[index].ratioList = [];
                })

                this.setState({
                    dataList: temp,
                    pages: json.pages,
                })
            });
    }
    ack = (id) => {
        fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/ack', {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.Edison_token,
            },
            body: JSON.stringify({
                action: 'monitor',
                type: id.type,
                status: id.status,
                description_new: this.state.ackDescription,
                description_old: id.description,
            })
        })
            .then(res => {
                fetch('http://bigdata-view.cootekservice.com:50056/dataMonitoringAndAlarm/alarmList', {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + localStorage.Edison_token,

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
                            if (temp[index].status) {
                                temp[index].checked = true;
                            } else {
                                temp[index].checked = false;
                            }

                            temp[index].ratioList = [];
                        })

                        this.setState({
                            dataList: temp,
                            pages: json.pages,
                        })
                    });
            })
    }
    handleAckDescription = (e) => {
        this.setState({
            ackDescription: e.target.value,
        });
    }
    render() {
        const ackModal = (
            <div>
                <p>The alarm information is as follows</p>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Server</th>
                            <th>Description</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.state.ackActive.type}</td>
                            <td>{this.state.ackActive.server}</td>
                            <td>{this.state.ackActive.description}</td>
                            <td>{this.state.ackActive.time.substring(0, 19)}</td>
                            <td>{this.state.ackActive.status}</td>
                        </tr>
                    </tbody>
                </Table>
                <p>If you want to acknowledge this alarm,please change it's description</p>
                <FormControl componentClass="textarea" placeholder="description"
                    value={this.state.ackDescription}
                    onChange={(e) => this.handleAckDescription(e)}
                />
            </div>
        );
        return (
            <div>
                <Col xsHidden smHidden md={12}><div className="placeholder-h30"></div></Col>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={10}>
                    <div className='page-title'>Alarm Table</div>
                    <AlarmTable
                        dataList={this.state.dataList}
                        isCheckAll={this.state.isCheckAll}

                        checkCheckbox={this.checkCheckbox}
                        checkAll={this.checkAll}
                        ack={this.showModalAck}
                        ackAll={this.showModalAckAll}
                        ratio={this.showRatio}
                    />
                    <PaginationAdvanced
                        items={+this.state.pages}//通过+将string转换为Number
                        maxButtons={5}
                        activePage={this.state.activePage}
                        onSelect={this.handleSelect}
                    />
                </Col>
                <Col xsHidden smHidden md={1}></Col>

                <Col xsHidden smHidden md={12}><div className="placeholder-h30"></div></Col>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={10} >
                    <div>
                        <ReactEcharts
                            option={this.state.echartsOption}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                        />
                    </div>
                </Col>
                <Col xsHidden smHidden md={1}></Col>
                <Col xsHidden smHidden md={12}><div className="placeholder-h30"></div></Col>
                <ModalPop
                    modalId={this.state.ackActive}
                    modalShow={this.state.modalShow}
                    modalTitle={<div><span className='strong'>Acknowledge</span> the alarm</div>}
                    modalBody={ackModal}
                    modalDo={"ACK"}
                    ackDescription={this.state.ackDescription}

                    closeModal={this.closeModal}
                    handleAckDescription={this.handleAckDescription}
                    handleDo={this.ack}
                />
            </div>
        )
    }
}