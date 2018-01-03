import React from 'react';
import { Pagination } from 'react-bootstrap';
export default class PaginationAdvanced extends React.PureComponent {
    constructor(props) {
        super(props);
    }
   
    
    render() {
        return (
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.items}
            maxButtons={this.props.maxButtons}
            activePage={this.props.activePage}
            onSelect={this.props.onSelect} />
            
        );
      }
}