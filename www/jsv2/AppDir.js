/**
 * AppDir
 * App的文件夹操作
 * @author LuoWen
 * @date 20160411
 */

var DownloadApp = require('./DownloadApp'),
    utils = require('./Utils');

var AppDir = function() {}

var p = AppDir.prototype;

/**
 * [listDir description]
 * @param  {[type]} dirPath [description]
 * @param  {[type]} success [description]
 * @param  {[type]} fail    [description]
 * @return 
 *  [{
            name: "11",
            totalSize: 0,
            totalSizeMb: 0,
            totalFileNum: 0,
            totalDirNum: 0,
            maxDirDepth: 0
        },
        ...
     ]
 */
p.getGamesInfo = function(callback, verbose) {
    var da = new DownloadApp();
    var gameDirNames = [];
    var gamesInfo = [];

    da.listDir('/', false, afterListDirSuccess, handleDirError, function(entry) {
        if (entry.name.match(/^mathgames(_ios)?\d{2}$/)) gameDirNames.push(entry.name);
    }, verbose);


    function afterListDirSuccess(data) {
        var name = gameDirNames.pop();
        if (name) {
            da.getDirSize(name, function(retData) {
                retData.name = name.match(/\D(\d{2})$/).pop(); //添加name属性  11,12,...34
                gamesInfo.push(retData);
                afterListDirSuccess(data);
            }, handleDirError, verbose);
        } else {
            typeof callback === 'function' && callback(null, gamesInfo);
        }
    }

    function handleDirError(error) {
        console.error(error);
        typeof callback === 'function' && callback(error);
    }
};

p.delGameDir = function(gameDirPath, callback) {
    var da = new DownloadApp();
    var gameDirSuffix = utils.isPlatformIOS() ? "_ios" : "";
    var gameDirPrefix = "mathgames";

    if(isNaN(gameDirPath)) {
        console.error("Variable: gameDirPath Need to be a Number!");
        return;
    }

    da.delDir(gameDirPrefix + gameDirSuffix + gameDirPath, true, function(data) {
        typeof callback === 'function' && callback(null, data);
    }, function(error) {
        typeof callback === 'function' && callback(error);
    });
};

module.exports = new AppDir();