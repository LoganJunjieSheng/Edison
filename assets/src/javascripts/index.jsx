import React from 'react';
import { Col } from 'react-bootstrap';
import fetch from 'node-fetch';

import Login from './components/login'
import '../stylesheets/index.css'

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div>
                <Col xsHidden smHidden md={12}><div className="placeholder-h30"></div></Col>
                <Col xsHidden smHidden md={1}></Col>
                <Col xs={12} md={10}>
                    <Login></Login>
                </Col>
                <Col xsHidden smHidden md={1}></Col>
            </div>

        );
    }
}


