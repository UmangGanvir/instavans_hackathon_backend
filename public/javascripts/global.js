/**
 * Created by umang on 05/03/16.
 */

function parseDate( str ){
    if(!/^(\d){2}-(\d){2}-(\d){4}$/.test(str)) return "invalid date string";
    var d = str.substr(0,2),
        m = parseInt( str.substr(3,2) ) - 1,
        y = str.substr(6,4);
    return new Date(y,m,d);
}