/**
 * Statis.js
 * @author LuoWen
 * @date 20160505
 */

var CST = require("./Const").CST,
    XHR = require('./XHR');

function Statis() {}
var STATIS_KEY = "statis";
var p = Statis.prototype;
var statisData = {
    "starttime": 0, //开始时间  [long]  
    "endtime": 0, //结束时间    [long]
    "downloadtime": -1, //总下载时间   [int] 秒
    "ip": "", //自己的IP     [string]
    "cdnip": "", // Cdn 的 Ip  [string]
    "dir": "", //资源类型  [string]
    "localversion": "", //本地版本  [string]
    "platform": "", //统计的平台  [string]
    "useragent": "", //userAgent  [string]
    "deviceuuid": "", //deviceuuid  [string]
    "fileinfos": [ //这次下载的文件信息
    ]
};
var fileInfo = {
    "canunzip": false, //能否解压   [boolean]
    "starttime": 0, //开始时间  [long]  
    "endtime": 0, //结束时间    [long]
    "downloadtime": -1, //下载时间   [int] 秒
    "errortimes": 0, //错误次数  [int]
    "filename": "", //文件名  [string]
    "filesize": "", //文件大小   [int] 字节
    "version": "" //版本   [string]
};

/**
 * 初始化统计数据
 * @return {[type]} [description]
 */
p.initStatisData = function() {
    if (getStatisData()) {
        statisData = getStatisData(); //获取上次存储的信息
    }
};

/**
 * 清理统计数据
 * @return {[type]} [description]
 */
p.clearStatisData = function() {
    window.localStorage.removeItem(STATIS_KEY);
}

p.setData = function(key, value, forceUpdate) {
    if (!forceUpdate && statisData[key]) return;

    statisData[key] = value;
    window.localStorage.setItem(STATIS_KEY, JSON.stringify(statisData));
};

function getStatisData() {
    return JSON.parse(window.localStorage.getItem(STATIS_KEY));
}

p.getData = function(key, defaultValue) {
    return getStatisData() && getStatisData()[key] || defaultValue;
};

p.startTime = function() {
    this.setData("starttime", new Date().getTime());
};

p.endTime = function(forceUpdate) {
    this.setData("endtime", new Date().getTime(), forceUpdate);
    this.setDownloadTime(forceUpdate);
};

p.setDownloadTime = function(forceUpdate) {
    this.setData("downloadtime", ~~((this.getData("endtime", 0) - this.getData("starttime", 0)) / 1000), forceUpdate);
}

p.setIp = function(ip) {
    this.setData("ip", ip);
}

p.setCdnIp = function(hostname) {
    var me = this;
    hostname = hostname.match(/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/);
    hostname = hostname.length && hostname[0] || "";

    cordova.plugins &&
        cordova.plugins.dns && 
            cordova.plugins.dns.resolve(hostname, success, failure);

    function success(address) {
        me.setData("cdnip", address);
        console.log('Resolved ' + hostname + ' to ' + address);
    }

    function failure(error) {
        var errormsg = 'Failed to resolve ' + hostname + ': ' + error;
        me.setData("cdnip", errormsg);
        console.log(errormsg);
    }
}

p.setDir = function(dirNum) {
    this.setData("dir", dirNum);
}

p.setLocalVersion = function(localVersion) {
    this.setData("localversion", localVersion);
}

p.setPlatform = function(platform) {
    this.setData("platform", platform);
}

p.setUserAgent = function(useragent) {
    this.setData("useragent", useragent);
}

p.setDeviceUUID = function(deviceuuid) {
    this.setData("deviceuuid", deviceuuid);
}

//-------------------FileInfos---------------------
p.setFileInfos = function(fileinfos, forceUpdate) {
    this.setData("fileinfos", fileinfos, forceUpdate);
}

p.getFileInfo = function() {
    return this.getData("fileinfos", []);
}

p.getFileInfoValueByKey = function(key, defaultValue) {
    var fileInfos = this.getFileInfo();
    var fi = fileInfos.pop();
    return fi[key] || defaultValue;
}

p.initFileInfo = function() {
    var fileInfos = this.getFileInfo();
    fileInfos.push(fileInfo);

    this.setFileInfos(fileInfos, true);
}

p.updateFileInfo = function(key, value) {
    var fileInfos = this.getFileInfo();
    var fi = fileInfos.pop();
    fi[key] = value;
    fileInfos.push(fi);

    this.setFileInfos(fileInfos, true);
}

//--------------FileInfo setters-------
p.setFICanUnzip = function(canunzip) {
    this.updateFileInfo("canunzip", canunzip);
}

p.startFIStartTime = function() {
    this.updateFileInfo("starttime", new Date().getTime());
}

p.endFIEndTime = function() {
    this.updateFileInfo("endtime", new Date().getTime());
    this.setFIDownloadTime();
}

p.setFIDownloadTime = function() {
    this.updateFileInfo("downloadtime", ~~((this.getFileInfoValueByKey("endtime", 0) - this.getFileInfoValueByKey("starttime", 0)) / 1000));
}

/**
 * 错误次数自增长
 * @return {[type]} [description]
 */
p.increaseFIErrorTimes = function() {
    var key = 'errortimes';
    this.updateFileInfo(key, +this.getFileInfoValueByKey(key, 0) + 1);
}

p.setFIFileName = function(filename) {
    this.updateFileInfo("filename", filename);
}

p.setFIFileSize = function(filesize) {
    this.updateFileInfo("filesize", filesize);
}

p.setFIVersion = function(version) {
    this.updateFileInfo("version", version);
}


// ----------------上传------------
p.uploadStatis = function(url) {
    var statisData = getStatisData();
    if (statisData) {
        var opt = {
            type: "POST",
            method: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(statisData)
        };
        XHR(url, success, fail, null, opt);
    }
}

function success(data) {
    p.clearStatisData(); //上传成功后，清理本地统计数据
    console.log("update success.", data);
}

function fail(data) {
    p.clearStatisData(); //上传失败后，清理本地统计数据
    console.log("update fail.", data);
}


module.exports = new Statis();