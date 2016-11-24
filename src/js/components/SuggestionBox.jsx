import React, {Component} from 'react';
import {debounce} from 'lodash'
import './SuggestionBox.css';

class SuggestionBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msBeforeQuery: 500,
            miniSearchLength: 3,
            // lastModifiedTime: -1,
            suggestionResults: [],
            loading: false
        };
    }

    debounceTypeHandler() {
        var debounceFunc;
        if (!this.state.debounceFunc) {
            debounceFunc = debounce(this._search.bind(this), 1000, {});
        }
        if (debounceFunc) debounceFunc();
        else this.state.debounceFunc();

    }

    _search() {
        this.setState({
            loading: true,
            suggestionResults: []
        });

        this.props.searchFunc(this.props.searchString)
            .then((result) => {
                this.setState({loading: false});
                return this.setState({
                    suggestionResults: result
                });
            })
            .catch((err) => {
                this.setState({loading: false});
                console.error('An error occured : ', err);
            });
    }

    onSuggestionClick = (e) => {
        console.log('suggestion click', e);
        this.props.onSuggestionClick(this.props.name, e.target.attributes["data-targetuser"].value);
    };

    componentWillReceiveProps(nextProps) {
        console.log('WillReceiveProps Call : ', nextProps.searchString, this.props.searchString);

        if (nextProps.searchString === this.props.searchString) return;
        this.setState({loading: true});
        // var lastModifiedTime = Date.now();
        // if (nextProps.searchString.length < this.state.miniSearchLength) return;

        // if (lastModifiedTime - this.state.lastModifiedTime > this.state.msBeforeQuery) {
        //     console.log('Sending new Query with value : ' + nextProps.searchString);
        //     if (this._search(nextProps.searchString, )
        // }
        if (nextProps.searchString.length >= this.state.miniSearchLength) {
            this.debounceTypeHandler();
        }

        // return this.setState({lastModifiedTime: lastModifiedTime});
    }

    onBlur = (e) => {
        console.log('loosing focus ! launching search !');
        this.props.onSearchedText(this.props.name, e.target.value);
    }

    _renderEmpty() {
        return null;
    }

    _renderTypeMore() {
        return <div className='suggestion-message'>Type at least <b>{this.state.miniSearchLength}</b> charaters to get
            suggesions.<br/>Search string : {this.props.searchString}</div>
    }

    _renderNoResults() {
        return <div className='suggestion-message'>No result found for <b>{this.props.searchString}</b>...</div>
    }

    _renderLoading() {
        return (
            <div>
                <div className="loader" style={{display:'inline-block'}}></div>

                Searching for <b>{this.props.searchString}</b>...
            </div>
        );
    }

    render() {
        console.log('SuggestionBox : rendering.... ', this.props, this.state);
        if (this.props.visible === false) return null;
        if (this.props.searchString.length < this.state.miniSearchLength) return this._renderTypeMore();
        if (this.state.loading) return this._renderLoading();
        if (this.state.suggestionResults.length === 0) return this._renderNoResults();

        var list = [];
        for (var i = 0; i < this.state.suggestionResults.length; i++) {
            let suggestion = this.state.suggestionResults[i];
            let suggestedText = '';
            if (suggestion.givenName !== null) suggestedText += suggestion.givenName;
            if (suggestion.surname !== null) suggestedText += ' ' + suggestion.surname;
            if (suggestedText.length > 0) {
                suggestedText = suggestion.samAccountName + ' (' + suggestedText + ')';
            } else {
                suggestedText = suggestion.samAccountName;
            }
            // console.log('building suggestedText, ', suggestedText);
            list.push(<li
                onClick={this.onSuggestionClick}
                data-targetuser={suggestion.samAccountName}>
                {suggestedText}
            </li>);
        }
        return (
            <div>
                <div className='suggestion-message'>
                    Suggestions de recherche pour : <b>{this.props.searchString}</b> ...
                </div>
                <br/>
                <ul className="ui-suggestion-list">
                    {list}
                </ul>
            </div>
        );
    }
}
;


export default SuggestionBox;