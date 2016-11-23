import $ from 'jquery';

var config = {
    apiHost: '127.0.0.1',
    apiPort: 3000
};

function normalizeList(objList) {
    let res = {};
    for (var i = 0; i < objList.length; i++) {
        let obj = objList[i];
        console.log('adding key', obj.samAccountName);
        res[obj.samAccountName] = obj;
    }
    return res;
}

function searchUser(searchString) {
    console.log('SEARCH Call ', searchString);
    // searchUser(searchName: searchString);

    console.log('searchUser(', searchString);

    return new Promise(function (resolve, reject) {
        // res = [{
        //     "givenName": "Fran�ois",
        //     "surname": "LAPLAUD",
        //     "userPrincipalName": "frl@sdis72.fr",
        //     "samAccountName": "frl",
        //     "distinguishedName": "CN=LAPLAUD Fran�ois,OU=Admins,OU=Comptes,OU=SDIS_72,DC=sdis72,DC=fr"
        // }]
        $.getJSON('http://' + config.apiHost + ':' + config.apiPort + '/command/searchUser?searchName=' + searchString)
            .done(function (arrResult) {
                resolve(arrResult);

            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    });

}

function addUserToGroup(params) {
    var identity = params.identity;
    var member = params.member;
    console.log('addUserToGroup(', identity, ',', member);
    var cmdParams = {Identity: identity, Member: member};
    return new Promise(function (resolve, reject) {
        $.post('http://' + config.apiHost + ':' + config.apiPort + '/command/execute/addADGroupMember', cmdParams)
            .done(function (data) {
                console.log(data);
                if (data.stderr === "") {
                    console.log('Command executed successfully : ', data.command)
                    resolve();
                } else {
                    console.warn('Command execution failed : ', data.command)
                    reject();
                }
                // render({user:user1, groups: l1}, {user: user2, groups: l2});
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    });
}

function removeUserFromGroup(params) {
    var identity = params.identity;
    var member = params.member;
    console.log('removeUserFromGroup(', identity, ',', member);
    var cmdParams = {Identity: identity, Member: member};
    return new Promise(function (resolve, reject) {
        $.post('http://' + config.apiHost + ':' + config.apiPort + '/command/execute/removeADGroupMember', cmdParams)
            .done(function (data) {
                console.log(data);
                if (data.stderr === "") {
                    console.log('Command executed successfully : ', data.command)
                    resolve();
                } else {
                    console.warn('Command execution failed : ', data.command)
                    reject();
                }
                // render({user:user1, groups: l1}, {user: user2, groups: l2});
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    });
}


function getUserGroups(text) {
    return new Promise(function (resolve, reject) {
        console.log(name + ' textSearched : ' + text);
        $.getJSON('http://' + config.apiHost + ':' + config.apiPort + '/command/getUserGroups?user=' + text)
        // $.getJSON('http://localhost:3000/command/searchUser?searchName=' + text)
            .done(function (data) {
                console.log('Group data received', data);
                var l = normalizeList(data);
                resolve(l);
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });

    });
}

const api = {
    searchUser:searchUser,
    addUserToGroup:addUserToGroup,
    removeUserFromGroup:removeUserFromGroup,
    getUserGroups:getUserGroups,
};

export default api;