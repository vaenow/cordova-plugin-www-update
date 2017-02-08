/**
 * Created by LuoWen on 2016/1/12.
 */
var urlParams = {};

var match,
    pl = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);

// 键=值
//?debug=true&scale=0.3
while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
}

module.exports = urlParams;
