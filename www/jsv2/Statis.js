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
    "starttime": 0, //��ʼʱ��  [long]  
    "endtime": 0, //����ʱ��    [long]
    "downloadtime": -1, //������ʱ��   [int] ��
    "ip": "", //�Լ���IP     [string]
    "cdnip": "", // Cdn �� Ip  [string]
    "dir": "", //��Դ����  [string]
    "localversion": "", //���ذ汾  [string]
    "platform": "", //ͳ�Ƶ�ƽ̨  [string]
    "useragent": "", //userAgent  [string]
    "deviceuuid": "", //deviceuuid  [string]
    "fileinfos": [ //������ص��ļ���Ϣ
    ]
};
var fileInfo = {
    "canunzip": false, //�ܷ��ѹ   [boolean]
    "starttime": 0, //��ʼʱ��  [long]  
    "endtime": 0, //����ʱ��    [long]
    "downloadtime": -1, //����ʱ��   [int] ��
    "errortimes": 0, //�������  [int]
    "filename": "", //�ļ���  [string]
    "filesize": "", //�ļ���С   [int] �ֽ�
    "version": "" //�汾   [string]
};

/**
 * ��ʼ��ͳ������
 * @return {[type]} [description]
 */
p.initStatisData = function() {
    if (getStatisData()) {
        statisData = getStatisData(); //��ȡ�ϴδ洢����Ϣ
    }
};

/**
 * ����ͳ������
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
 * �������������
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


// ----------------�ϴ�------------
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
    p.clearStatisData(); //�ϴ��ɹ���������ͳ������
    console.log("update success.", data);
}

function fail(data) {
    p.clearStatisData(); //�ϴ�ʧ�ܺ�������ͳ������
    console.log("update fail.", data);
}


module.exports = new Statis();