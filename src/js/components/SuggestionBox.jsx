import React, { Component } from 'react';
import {debounce} from 'lodash'

class SuggestionBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msBeforeQuery: 500,
            miniSearchLength: 3,
            // lastModifiedTime: -1,
            suggestionResults: []
        };
    }
    debounceTypeHandler(){
        var debounceFunc;
        if (!this.state.debounceFunc){
            debounceFunc = debounce(this._search.bind(this), 1000, {});
            this.setState({
                debounceFunc: debounceFunc
            });
        }
        if (debounceFunc) debounceFunc();
        else this.state.debounceFunc();

    }
    _search(){
        console.log('_search!!');

        this.props.searchFunc(this.props.searchString)
            .then((result) => {
                return self.setState({
                    suggestionResults: result
                });
            })
            .catch((err) => {
                console.error('An error occured : ', err);
            });
    }
    onSuggestionClick = (e) => {
        console.log('suggestion click', e);
        this.props.onSuggestionClick(e.target.attributes["data-targetuser"].value);
    }
    componentWillReceiveProps(nextProps) {
        console.log('WillReceiveProps Call : ', nextProps);
        // var lastModifiedTime = Date.now();
        // if (nextProps.searchString.length < this.state.miniSearchLength) return;

        // if (lastModifiedTime - this.state.lastModifiedTime > this.state.msBeforeQuery) {
        //     console.log('Sending new Query with value : ' + nextProps.searchString);
        //     if (this._search(nextProps.searchString, )
        // }
        this.debounceTypeHandler();

        // return this.setState({lastModifiedTime: lastModifiedTime});
    }
    onBlur = (e) => {
        console.log('loosing focus ! launching search !');
        this.props.onSearchedText(this.props.name, e.target.value);
    }
    render() {
        var list = [];
        for (var i=0;i<this.state.suggestionResults.length;i++){
            var suggestion = this.state.suggestionResults[i];
            var suggestedText = suggestion.samAccountName;
            suggestedText += ' (';
            if (suggestion.givenName !== 'null') suggestedText += suggestion.givenName;
            if (suggestion.surname !== 'null') suggestedText += ' ' + suggestion.surname;
            suggestedText += ')';
            console.log('building suggestedText, ', suggestedText);
            list.push(<li
                onClick={this.onSuggestionClick}
                data-targetuser={suggestion.samAccountName}>
                {suggestedText}
            </li>);
        }
        return (
            <div>
                Suggestions de recherche pour : {this.props.searchString} ...
                <br/>
                <ul>
                    {list}
                </ul>
            </div>
        );
    }
};


export default SuggestionBox;