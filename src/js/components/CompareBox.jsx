import React, { Component } from 'react';

// import {alphabetical} from 'helperfuncs';
import './index.css';


function alphabetical(a, b)
{
    var A = a.toLowerCase();
    var B = b.toLowerCase();
    if (A < B){
        return -1;
    }else if (A > B){
        return  1;
    }else{
        return 0;
    }
}


class CompareBox  extends Component{
    constructor(props) {
        super(props);
        console.log('getinitialState');
        this.state = {
            displayMode: this.props.displayMode || '3pans', // 'table', 'diffmode?'
            user1: this.props.user1.user,
            user2: this.props.user2.user,
            list1: this.props.user1.groups,
            list2: this.props.user2.groups,

        };
    }
    componentWillReceiveProps(nextProps) {
        console.log('WillReceiveProps Call : ', nextProps);
        this.setState({
            displayMode: nextProps.displayMode || '3pans', // 'table', 'diffmode?'
            user1: nextProps.user1.user,
            user2: nextProps.user2.user,
            list1: nextProps.user1.groups,
            list2: nextProps.user2.groups
        });
    }
    _addUserToGroup(e, userProperty) {
        var user = this.state[userProperty];
        var group = JSON.parse(e.target.attributes["data-targetgroup"].value);
        return this.props.addUserToGroup({//listToRender.initialList[key]
            identity: group.samAccountName,
            member: user
        })
            .then(()=> {
                var targetListName = (userProperty === 'user1') ? 'list1' : 'list2';
                var targetList = this.state[targetListName];

                targetList[group.samAccountName] = group;
                // newList[group.samAccountName] = group;
                console.log('Successfully added ' + user + ' to group ' + group.samAccountName);
                var newState = {};
                Object.assign(newState, targetList);
                this.setState(newState);
            });
    }
    _removeUserFromGroup(e, userProperty) {
        var user = this.state[userProperty];
        var group = JSON.parse(e.target.attributes["data-targetgroup"].value);
        return this.props.removeUserFromGroup({//listToRender.initialList[key]
            identity: group.samAccountName,
            member: user
        })
            .then(()=> {
                var targetListName = (userProperty === 'user1') ? 'list1' : 'list2';
                var targetList = this.state[targetListName];

                delete targetList[group.samAccountName];
                // newList[group.samAccountName] = group;
                console.log('Successfully added ' + user + ' to group ' + group.samAccountName);
                var newState = {};
                Object.assign(newState, targetList);
                this.setState(newState);
            });
    }
    addUser1ToGroup(e) {
        return this._addUserToGroup(e, 'user1');
    }
    addUser2ToGroup(e) {
        return this._addUserToGroup(e, 'user2');
    }
    removeUser1FromGroup(e) {
        return this._removeUserFromGroup(e, 'user1');
    }
    removeUser2FromGroup(e) {
        return this._removeUserFromGroup(e, 'user2');
    }
    onClick(e) {
//         this.setState({text: e.target.value});
//         if (e.key === 'Enter') {
//             this.props.onSearchedText(this.props.name, e.target.value);
//         }
    }

    _prepareRenderingList() {
        // generation of the 3 lists of objects (in1, in2, inBoth)
        var in1 = {};
        var in2 = {};
        var inBoth = {};

        var verificationsPoints = [
            {srcList: this.state.list1, dstList: this.state.list2, commonList: inBoth, specificList: in1},
            {srcList: this.state.list2, dstList: this.state.list1, commonList: inBoth, specificList: in2}
        ];
        for (var j = 0; j < verificationsPoints.length; j++) {
            var verificationsPoint = verificationsPoints[j];
            for (var i = 0; i < Object.keys(verificationsPoint.srcList).length; i++) {
                var key = Object.keys(verificationsPoint.srcList)[i];
                var value = verificationsPoint.srcList[key];

                if (Object.keys(verificationsPoint.dstList).indexOf(key) > -1) verificationsPoint.commonList[key] = value;
                else verificationsPoint.specificList[key] = value;
            }
        }

        // generation of the rendering list

        return {
            in1: {initialList: in1, renderingList: []},
            in2: {initialList: in2, renderingList: []},
            inBoth: {initialList: inBoth, renderingList: []}
        };
    }
    _render3Pans(listsToRender) {
        var listsToRenderKeys = Object.keys(listsToRender);
        for (var i = 0; i < listsToRenderKeys.length; i++) {
            var listToRenderKeyName = listsToRenderKeys[i];
            var listToRender = listsToRender[listToRenderKeyName];
            var keys = Object.keys(listToRender.initialList);
            var renderingList = listToRender.renderingList;
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                var valueToDisplay = listToRender.initialList[key].samAccountName; // HERE Comes the Field Selection
                var childs = [];
                childs.push(valueToDisplay + ' ');
                var jsonGroup = JSON.stringify(listToRender.initialList[key]);
                switch (listToRenderKeyName) {
                    case 'in2':
                        childs.push(<a href="#" className="ui-btn-add-group glyphicon glyphicon-plus"
                                       onClick={this.addUser1ToGroup}
                                       title={ "Add to " + this.state.user1}
                                       data-targetgroup={jsonGroup}>{this.state.user1}</a>);
                        childs.push(', ');
                        childs.push(<a href="#" className="ui-btn-remove-group glyphicon glyphicon-minus"
                                       onClick={this.removeUser2FromGroup}
                                       title={ "Remove from " + this.state.user2}
                                       data-targetgroup={jsonGroup}>{this.state.user2}</a>);
                        break;
                    case 'in1':
                        childs.push(<a href="#" className="ui-btn-add-group glyphicon glyphicon-plus"
                                       onClick={this.addUser2ToGroup}
                                       title={ "Add to " + this.state.user2}
                                       data-targetgroup={jsonGroup}>{this.state.user2}</a>);
                        childs.push(', ');
                        childs.push(<a href="#" className="ui-btn-remove-group glyphicon glyphicon-minus"
                                       onClick={this.removeUser1FromGroup}
                                       title={ "Remove from " + this.state.user1}
                                       data-targetgroup={jsonGroup}>{this.state.user1}</a>);
                        break;
                    case 'inBoth':
                        childs.push(<a href="#" className="ui-btn-remove-group glyphicon glyphicon-minus"
                                       onClick={this.removeUser1FromGroup}
                                       title={ "Remove from " + this.state.user1}
                                       data-targetgroup={jsonGroup}>{this.state.user1}</a>);
                        childs.push(', ');
                        childs.push(<a href="#" className="ui-btn-remove-group glyphicon glyphicon-minus"
                                       onClick={this.removeUser2FromGroup}
                                       title={ "Remove from " + this.state.user2}
                                       data-targetgroup={jsonGroup}>{this.state.user2}</a>);
                        break;
                }


                var list = React.createElement('li', null, childs);
                // list = list + {valueToDisplay};
                // list = list + </li>;
                renderingList.push(list);
            }
        }

        return (
            <div class="row">

                <div className="row">
                    <div className="col-xs-6">
                        <h2>Only on {this.state.user1}</h2>
                        <ul className="ui-group-list">{ listsToRender.in1.renderingList}</ul>
                    </div>
                    <div className="col-xs-6">
                        <h2>Only on {this.state.user2}</h2>
                        <ul className="ui-group-list">{listsToRender.in2.renderingList}</ul>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <h2>Found on Both {this.state.user1} and {this.state.user2}</h2>
                        <div>
                            <ul className="ui-group-list">{listsToRender.inBoth.renderingList}</ul>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
    _renderTable(listsToRender) {
        // build global group list
        var globalGroups = {};
        var group;
        for (group in this.state.list1)
            globalGroups[group] = this.state.list1[group];
        for (group in this.state.list2)
            globalGroups[group] = this.state.list2[group];

        var globalGroupNames = Object.keys(globalGroups);
        globalGroupNames.sort(alphabetical);
        var rows = [];
        var groupList1 = Object.keys(this.state.list1);
        var groupList2 = Object.keys(this.state.list2);

        for (var i = 0; i < globalGroupNames.length; i++) {
            // var jsonGroup = ""; /////////////////////////////////////////////////////////////// TODO DEFINE !!!
            var samAccountName = globalGroupNames[i];
            var jsonGroup = JSON.stringify(globalGroups[samAccountName]);
            var row = [];
            row.push(<td>{samAccountName}</td>);
            if (groupList1.indexOf(samAccountName) >= 0) {
                row.push(
                    <td className="text-center"><span className="in-group glyphicon glyphicon-ok"
                                                      onClick={this.removeUser1FromGroup}
                                                      title={ "Remove " + this.state.user1 + " from group " + samAccountName}
                                                      data-targetgroup={jsonGroup}> </span></td>);
            } else {
                row.push(
                    <td className="text-center"><span className="not-in-group glyphicon glyphicon-remove"
                                                      onClick={this.addUser1ToGroup}
                                                      title={ "Add " + this.state.user1 + " to group " + samAccountName}
                                                      data-targetgroup={jsonGroup}> </span></td>);
            }
            if (groupList2.indexOf(samAccountName) >= 0) {
                row.push(
                    <td className="text-center"><span className="in-group glyphicon glyphicon-ok"
                                                      onClick={this.removeUser2FromGroup}
                                                      title={ "Remove " + this.state.user2 + " from group " + samAccountName}
                                                      data-targetgroup={jsonGroup}> </span></td>);
            } else {
                row.push(
                    <td className="text-center"><span className="not-in-group glyphicon glyphicon-remove"
                                                      onClick={this.addUser2ToGroup}
                                                      title={ "Add " + this.state.user2 + " to group " + samAccountName}
                                                      data-targetgroup={jsonGroup}> </span></td>);
            }


            rows.push(<tr>{row}</tr>);
            // console.log('Group LIST', samAccountName);
        }
        // add groupname td
        // add td if group in list 1 || td emptu etc
        //display table footer
        return (
            <div>
                <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>GroupName</th>
                        <th className="text-center">{this.state.user1}</th>
                        <th className="text-center">{this.state.user2}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>

            </div>
        );
    }

    render() {
        var listsToRender = this._prepareRenderingList();
        if (this.state.user1.length <= 0 && this.state.user2.length <= 0) {

            return (
                <div className="row">
                    <div className="col-xs-12">
                        Please select at least one username and don't forget to hit Enter and wait for the result !
                    </div>
                </div>
            );
        }

        switch (this.state.displayMode) { //'3pans', // 'table', 'diffmode?'
            case '3pans':
                return this._render3Pans(listsToRender);
                break;
            case 'table':
                return this._renderTable(listsToRender);
                break;
        }

    }
}

export default CompareBox;