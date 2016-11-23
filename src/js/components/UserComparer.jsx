import React, {Component} from 'react';
import SearchBox from './SearchBox';
import CompareBox from './CompareBox';
import SuggestionBox from './SuggestionBox';


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';


class UserComparer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user1: "",
            user2: "",

            userdata1: {
                user: '', groups: []
            },
            userdata2: {
                user: '', groups: []
            },
            displaySuggestion: {
                user1: false,
                user2: false,
            }
        }
    };


    handleSearchFieldChange = (e) => {
        let fieldName = e.target.attributes['data-fieldname'].value;
        let value = e.target.value;
        console.log("Changed text ", fieldName, '==>', value);
        this._setSearchField(fieldName, value);
        if (e.key === 'Enter') {
            this.launchSearch(fieldName, value);
        }
    };

    handleKeyPress = (e) => {
        let fieldName = e.target.attributes['data-fieldname'].value;
        let newState = { displaySuggestion: {} };
        newState.displaySuggestion[fieldName] = true;

        this.setState(newState);
    };

    _setSearchField(fieldName, value) {
        let newState = {};
        newState[fieldName] = value;
        this.setState(newState);
    }

    launchSearch(fieldName, value) { // launch search from props.name)
        let newStateFieldName;
        if (fieldName === 'user1') {
            newStateFieldName = 'userdata1';
        } else {
            newStateFieldName = 'userdata2';
        }

        this.props.api.getUserGroups(value)
            .then((list)=> {
                let newState = {};
                newState[newStateFieldName] = {
                    user: value, groups: list
                };
                this.setState(newState);
            })
    }

    handleSuggestionClick = (fieldName, value) => {
        let newState = {};
        Object.assign(newState, this.state);
        newState.displaySuggestion[fieldName] = false;
        this.setState(newState);


        this._setSearchField(fieldName, value);
        this.launchSearch(fieldName, value);

    }

    handleSearchFieldBlur = (e) => {
        return null; // FOR NOW DO NOTHING...
        this.props.onBlur(e.target.value);
    }

    getGroups(componentName, searchString) {
        this.props.api.getUserGroups(searchString)
            .then((list) => {
                if (componentName === 'user1') {
                    this.setState({
                        userdata1: {
                            user: searchString,
                            groups: list
                        }
                    });
                } else {
                    this.setState({
                        userdata2: {
                            user: searchString,
                            groups: list
                        }
                    });
                }
            });
        //
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="row">
                            <div className="col-xs-12">
                                <SearchBox key="user1"
                                    name="user1"
                                    value={this.state.user1}
                                    onBlur={this.handleSearchFieldBlur}
                                    onChange={this.handleSearchFieldChange}
                                    onKeyPress={this.handleKeyPress}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <SuggestionBox
                                    key="user1"
                                    name="user1"
                                    visible={this.state.displaySuggestion.user1}
                                    searchString={this.state.user1}
                                    searchFunc={this.props.api.searchUser}
                                    onSuggestionClick={this.handleSuggestionClick}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="row">
                            <div className="col-xs-12">
                                <SearchBox
                                    key="user2"
                                    name="user2"
                                    value={this.state.user2}
                                    onBlur={this.handleSearchFieldBlur}
                                    onChange={this.handleSearchFieldChange}
                                    onKeyPress={this.handleKeyPress}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <SuggestionBox
                                    key="user2"
                                    name="user2"
                                    searchString={this.state.user2}
                                    visible={this.state.displaySuggestion.user2}
                                    searchFunc={this.props.api.searchUser}
                                    onSuggestionClick={this.handleSuggestionClick}/>
                            </div>
                        </div>
                    </div>

                </div>
                <br/>
                <div className="row">
                    <div className="col-xs-3"></div>
                    <div className="col-xs-6">
                        <CompareBox
                            user1={this.state.userdata1}
                            user2={this.state.userdata2}
                            addUserToGroup={this.props.api.addUserToGroup}
                            removeUserFromGroup={this.props.api.removeUserFromGroup}
                            displayMode="table"
                        />
                    </div>
                    <div className="col-xs-3"></div>
                </div>
            </div>
        );
    }
}


export default UserComparer;
