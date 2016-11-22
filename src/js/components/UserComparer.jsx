import React, {Component} from 'react';
import SearchBox from './SearchBox';
import CompareBox from './CompareBox';


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';


import api from './apifuncs'


class UserComparer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",

            userdata1: {
                user: '', groups: []
            },
            userdata2: {
                user: '', groups: []
            }

        }

    };

    getGroups(componentName, searchString) {
        api.getUserGroups(searchString)
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
                        <SearchBox
                            name="user1"
                            onSearchedText={api.getUserGroups}
                            searchFunc={api.searchUser}
                        />
                    </div>
                    <div className="col-xs-6">
                        <SearchBox
                            name="user2"
                            onSearchedText={api.getUserGroups}
                            searchFunc={api.searchUser}
                        />
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-xs-3"></div>
                    <div className="col-xs-6">
                        <CompareBox
                            user1={this.state.userdata1}
                            user2={this.state.userdata2}
                            addUserToGroup={api.addUserToGroup}
                            removeUserFromGroup={api.removeUserFromGroup}
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
