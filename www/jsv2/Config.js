/**
 * Config.js
 */


    var BUILDIN_URL = "buildin/index.html",
        CLIENT_TYPE = {
            TEACHER: "teacher",
            STUDENT: "student",
            PARENT: "parent"
        };
    var clientType = CLIENT_TYPE.STUDENT;

    //-----------------------------------------
    
    // 用于开发版本的临时测试
    var IS_TEMP_UPLOAD = getSavedData("tempUpload", false);
    // 用于发布版维护的 Debug
    var IS_DEBUG = getSavedData("releaseDebug", false);  //@deprecated
    // 是否使用断点续下载
    var IS_USING_PRD = getSavedData("usingPRD", true);
    var PRD_BLOCK_SIZE = 1024 * 1024 * 7;

    // var URL_REMOTE_DEFAULT =  "http://192.168.3.103:9080";
    // var URL_REMOTE_RESOURCE = "http://192.168.3.103/update";
    // var URL_REMOTE_DEFAULT =  "http://192.168.0.165:9080";
    // var URL_REMOTE_RESOURCE = "http://192.168.0.165/update";
    var URL_REMOTE_DEFAULT =  "http://192.168.0.161:9080";
    var URL_REMOTE_RESOURCE = "http://192.168.0.161:9060";
    // var URL_REMOTE_DEFAULT =  "http://xuexiQ.cn:9080";
    // var URL_REMOTE_RESOURCE = "http://tx.static.mathfunfunfun.com/update";

    //-----------------------------------------

    function isClientTeacher() {
        return clientType === CLIENT_TYPE.TEACHER;
    }

    function isClientStudent() {
        return clientType === CLIENT_TYPE.STUDENT;
    }

    function isClientParent() {
        return clientType === CLIENT_TYPE.PARENT;
    }

    function getBuildinUrl() {
        return BUILDIN_URL;
    }

    function getSavedData(key, defaultValue) {
        return window.localStorage.getItem(key) || defaultValue;
    }

    module.exports = {
        clientType: clientType
        , URL_REMOTE_DEFAULT: URL_REMOTE_DEFAULT
        , URL_REMOTE_RESOURCE: URL_REMOTE_RESOURCE
        , isClientTeacher: isClientTeacher
        , isClientStudent: isClientStudent
        , isClientParent: isClientParent
        , getBuildinUrl: getBuildinUrl
        , IS_TEMP_UPLOAD: IS_TEMP_UPLOAD
        , IS_DEBUG: IS_DEBUG
        , IS_USING_PRD: IS_USING_PRD
        , PRD_BLOCK_SIZE: PRD_BLOCK_SIZE
    };
