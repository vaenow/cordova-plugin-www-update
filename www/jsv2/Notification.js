/**
 * Notification.js
 *
 * @author LuoWen
 * @deprecated  20160301
 */

var CST = require("./Const").CST,
    utils = require("./Utils");

var Notification = function() {}
var NOTIFY_ID = 99;

Notification.prototype.watching = function() {
    if (global.isLoading && utils.isPlatformIOS()) {
        document.addEventListener("pause", sendNotify);
        document.addEventListener("resume", clearNotify)
    }
};

var clearNotify = function() {
    cordova.plugins.notification.local.clear(NOTIFY_ID);
};

var sendNotify = function() {
    clearNotify();
    
    //提醒进入后台更新
//    cordova.plugins.notification.local.schedule({
//        id: NOTIFY_ID + 1,
//        text: CST.NOTIFICATION_REMIND_INTO_BG,
//        at: getSecFromNow(3), //3 sec
//        led: "FF000",
//        sound: null
//    });

    //提醒需要重新登录
    cordova.plugins.notification.local.schedule({
        id: NOTIFY_ID,
        text: CST.NOTIFICATION_ASK_TO_RETRIEVE,
        at: getSecFromNow(60 * 2), //2 mins
        led: "FF000",
        sound: null
    });
}

var getSecFromNow = function(sec) {
    var now = new Date().getTime();
    return new Date(now + (sec || 0) * 1000);
}

module.exports = new Notification();
