/**
 * CheckVersion.js
 */


    var channel = require('cordova/channel'),
        XHR = require("./XHR"),
        constants = require("./Const"),
        msgBox = require("./MsgBox"),
        utils = require("./Utils");

    var CST = constants.CST;

    /**
     * 处理在更新范围外，需要更新的情况
     * @param  {[type]} needUpdate [description]
     */
    function handleOutOfUpdateScale(needUpdate) {
        if (needUpdate) {
            msgBox.confirm(CST.RESOUCES_NEED_UPDATE_ONRESUME, function () {
                //var path = "";
                //if (utils.isPlatformIOS()) {
                //    path = utils.getAssetPath4IOS();
                //} else {
                //    path = "file:///android_asset/www/index.html";
                //}

                window.location.href = utils.getAssetPathIndex() + "?action=" + CST.ONRESUME_DIRECT_UPDATE;
            });
        }
    }

    /*function checkVersion() {

        function _done(data) {
            checkDiff(data);
        }

        function _fail(data) {
            var errMsg = "当前网络不可用，请检查你的网络设置。";
            if (window.plugins && window.plugins.toast && window.plugins.toast.showLongCenter)
                window.plugins.toast.showLongTop(errMsg);
            else window.alert(errMsg);
        }

        XHR(CST.MANIFEST_REMOTE, _done, _fail);
    }

    function getStoredMainVersion() {
        return window.localStorage.getItem("mainVersion");
    }

    function getStoredIOSPath() {
        return window.localStorage.getItem("iosAssetPath");
    }

    function checkDiff(manifestData) {
        if (manifestData.mainVersion === getStoredMainVersion()) return;

        if (window.confirm("资源需要更新，请确认！")) {
            var path = "";
            if (isPlatformIOS()) {
                path = getStoredIOSPath();
            } else {
                path = "file:///android_asset/www/index.html";
            }

            window.location.href = path;
        }
    }*/


    module.exports = {
        handleOutOfUpdateScale: handleOutOfUpdateScale,
    }
