/**
 * DeleteDir.js
 * @author LuoWen
 * @date 20160303
 */

var DownloadApp = require("./DownloadApp"),
    logger = require("./Logger"),
    utils = require("./Utils"),
    CST = require("./Const").CST;

function deleteDir(dirName, recursive, success, fail) {
    var App = new DownloadApp();

    App.delDir(dirName, recursive || true, success || successCallBack, fail || failCallBack);

}

function successCallBack(entry) {
    if(entry) logger('success delete directory: ' + entry.name);
    $("#btnLoad").trigger("click");
}

function failCallBack() {

}

module.exports = deleteDir;