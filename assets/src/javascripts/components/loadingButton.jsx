import React, {PureComponent} from 'react';
import {Button} from 'react-bootstrap';
// import '../../stylesheets/index.css'

export default class LoadingButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    handleClick = () => {
        let that = this;
        this.setState({isLoading: true});

        // This probably where you would have an `ajax` call
        setTimeout(() => {
            // Completed of async action, set loading state back
            this.setState(
                {isLoading: false}
            );
            this.props.handleDo(this.props.id);
            that.props.closeModal();
        }, 1);
    }

    render() {
        let isLoading = this.state.isLoading;
        return (

            <Button
                bsStyle="primary"
                disabled={isLoading}
                onClick={!isLoading ? this.handleClick : null}>
                {isLoading ? 'Loading...' : this.props.name}
            </Button>

        );
    }
}