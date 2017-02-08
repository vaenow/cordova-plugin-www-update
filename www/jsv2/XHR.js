/**
 * Created by Luowen on 2014/5/20.
 */
    var utils = require("./Utils"),
        logger = require("./Logger");

    var XHR = function(url, done, fail, always, opt) {
        var xhr = {
            type: "GET",
            url: url + getUrlDelimiter(url) + "dt=" + new Date().getTime(),
            dataType: 'json',
            timeout: 30*1000
        };

        //merge options
        for (var p in opt) {
            xhr[p] = opt[p];
        }
        
        /*if(utils.isPlatformIOS()) {
            xhr.dataType = "jsonp";
            xhr.jsonpCallback = "_cb_";
        }*/

        return $.ajax(xhr)
            .done(done || function (data) {
                logger('manifest.json success!');
            })
            .fail(fail || function (data) {
                logger('manifest.json fail!');
            })
            .always(always || function (data) {
            });
    };

    var getUrlDelimiter = function(preUrl){
        return (preUrl && preUrl.match(/\?/)) ? "&" : "?";
    };

    module.exports = XHR;
