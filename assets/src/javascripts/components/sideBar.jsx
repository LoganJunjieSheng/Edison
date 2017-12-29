import React from 'react';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';

import '../../stylesheets/index.css'
export default class SiderBar extends React.PureComponent {
    render() {
        const itemList = this.props.itemList;
        let items = [];
        itemList.map((item,index) => {
            items.push(<ListGroupItem key={index} ><div>{item}</div></ListGroupItem>);
        })

        return (
            <Panel collapsible defaultExpanded header="Time" >
                <ListGroup fill >
                    {items}
                </ListGroup>
            </Panel>
        )
    }
}