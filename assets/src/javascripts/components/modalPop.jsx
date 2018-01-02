import React from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import LoadingButton from '../components/loadingButton'

export default class ModalPop extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleAckDescription=(e)=>{
        this.props.handleAckDescription(e);
    }

    render() {
        return (
            <Modal show={this.props.modalShow} onHide={this.props.closeModal}>

                <Modal.Header closeButton>
                    <Modal.Title>{this.props.modalTitle}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {this.props.modalBody}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.closeModal}>Cannel</Button>
                    <LoadingButton
                        id={this.props.modalId}
                        name={this.props.modalDo}
                        closeModal={this.props.closeModal}
                        handleDo={this.props.handleDo}
                    />
                </Modal.Footer>


            </Modal>

        );
    }
}
