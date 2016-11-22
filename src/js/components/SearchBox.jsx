import React, { Component } from 'react';
import SuggestionBox from './SuggestionBox';
 
class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            user1: {user: '', groups: []},
            user2: {user: '', groups: []},
        };
    }
    handleChange = (e) => {
        this.setState({text: e.target.value});
        if (e.key === 'Enter') {
            this._startSearch(e.target.value);
        }
    }
    _startSearch(value){ // launch search from props.name)
        this.props.onSearchedText(this.props.name, value);
    }
    setSearchField = (value) => {
        console.log('setSearchField:', value);
        this.setState({
            text: value
        });
        this._startSearch(value);

    }

    onBlur = (e) => {
        this._startSearch(e.target.value);
    }
    render() {

        return (
            <div>
                <label htmlFor={ 'searchbox_' + this.props.name }>{this.props.name}</label>
                <input className="form-control" id={ 'searchbox_' + this.props.name }
                       onChange={this.handleChange}
                       onBlur={ this.onBlur } type="text"
                       value={this.state.text}
                />
                <br/>
                <div className="row">
                    <div className="col-xs-12">
                        <SuggestionBox searchString={this.state.text} searchFunc={this.props.searchFunc} onSuggestionClick={this.setSearchField}/>
                    </div>
                </div>
            </div>

        );
    }
}


export default SearchBox;