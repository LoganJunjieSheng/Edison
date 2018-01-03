import React from 'react';
import {Jumbotron, Button} from 'react-bootstrap';
import '../stylesheets/index.css'

export default class Index extends React.PureComponent {
    render() {
        return (
            <div>
                <Jumbotron>
                    <div className="width60">
                        <h1>Hello, world!</h1>
                        <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to
                            featured content or information.</p>
                        <p><Button bsStyle="primary">了解更多</Button></p>
                    </div>
                </Jumbotron>


            </div>

        );
    }
}


