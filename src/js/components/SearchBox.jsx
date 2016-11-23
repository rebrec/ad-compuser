import React, { Component } from 'react';

 
class SearchBox extends Component {
    constructor(props) {
        super(props);
    }
    render(){

        return (
            <div>
                <label htmlFor={ 'searchbox_' + this.props.name }>{this.props.name}</label>
                <input className="form-control" id={ 'searchbox_' + this.props.name }
                       onChange={this.props.onChange}
                       onBlur={ this.props.onBlur } type="text"
                       onKeyPress={this.props.onKeyPress}
                       value={this.props.value}
                       data-fieldname={this.props.name}
                />
                
            </div>

        );
    }
}


export default SearchBox;