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


function normalizeList(objList) {
    var res = {};
    for (var i = 0; i < objList.length; i++) {
        obj = objList[i];
        console.log('adding key', obj.samAccountName);
        res[obj.samAccountName] = obj;
    }
    return res;
}