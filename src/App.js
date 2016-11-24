import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import UserComparer from './js/components/UserComparer';
import api from './apifuncs'

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Active Directory User Comparator</h2>
                </div>
                <UserComparer api={api}/>
            </div>
        );
    }
}


export default App;
