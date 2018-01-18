import React from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import LoadingButton from '../components/loadingButton'

export default class ModalPop extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
fetchMessage=()=>{
    fetch('http://bigdata-view.cootekservice.com:50056/test', {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username:'jack',
            password:'secret'
        })
    })
        .then(res => {console.log(res)})
        
    // console.log(1)
}
    render(){
        return(
            <div>
                <Button onClick={this.fetchMessage}>123</Button>
            </div>
        )
    }
}