/**
 * index.js
 * @author LuoWen
 * @date 20150606
 */
//(function () {

    window.$ = window.jQuery = require("./jquery-1.11.0.min");
    window._ = require("./underscore");
    window.bs = require("./bootstrap.min");

    var constants = require('./Const'),
        update = require('./Update'),
        utils = require('./Utils'),
        backBtn = require('./BackBtn'),
        CST = constants.CST;

    window.isLoadedOnce = false; //未设置OnResume事件
    window.netErrorRetryTimes = 0; //网络错误重试次数

    document.addEventListener("deviceready", onDeviceReady, false);
   
    function onDeviceReady() {
        //debugger
        console.time(CST.TIMER_CHECK_UPDATE_ALL);
        ensureToUpdater2StartUp(); // toupdater -> startup
        ensureStartUp2Exam(); // startup -> exam
        setOnResumeUpdate(utils);
        // navigator.splashscreen.hide();
        //logger('准备检查版本...');
        constants.initConstants(CST);
        update.registerHandlers();
        utils.setAssetPath();

        backBtn.init();

        handleStatis();
        if (utils.isAppToUpdater()) {
            // isUpdaterDirExist(function(err, isExist){
            //     !!isExist.isExist //自动更新文件夹 是否存在
            //         ? location.href = CST.MANIFEST_UPDATER_DIR_FULL + "index.html?action=startup"
            //         : checkResources(); // 如果不存在自动更新，则更新！
            // });
            checkResources(); // 如果不存在自动更新，则更新！
        } else if (utils.isAppStartUp()) {
            isExamDirExist(function(err, isExist) {
                !!isExist.isExist
                    ? $("#run").trigger('click')
                    : checkResources();
            });
        } else {
            //检查最新版本
            checkResources();
        }

        window.isLoadedOnce = true;
    }

    /**
     * 如果 Cordova 框架未初始化，重新加载
     */
    function checkDeviceReadyFail() {
        var channel = require('cordova/channel');

        if (channel.onDeviceReady.state != 2) {
            console.log('deviceready has not fired after 5 seconds. Reload!');
            window.location.reload();
        }

    }

    /**
     * 添加OnResume事件
     * @param {[type]} utils [description]
     */
    function setOnResumeUpdate(utils) {
        if (!utils.isOnResumeUpdate() || utils.isLoadOnceOnResumeUpdate()) return;

        document.removeEventListener("resume", onDeviceReady);
        document.addEventListener("resume", onDeviceReady);
        createOnResumeDom();
    }


    /**
     * 添加OnResume事件所需的Dom
     * @return {[type]} [description]
     */
    function createOnResumeDom() {
        var btns = ["check", "btnLoad", "reset", "run"];
        if ($("#" + btns[0]).size() !== 0) return;

        btns.forEach(function(id) {
            document.body.appendChild($("<div id='" + id + "'></div>")[0]);
        });
    }

    /**
     * 确保程序启动时，进入自动更新
     */
    function ensureToUpdater2StartUp() {
        if(utils.isAppToUpdater()) {
            utils.setDirLocal(99);
        }
    }

    /**
     * 确保状态为 自动更新 时，进入作业端
     */
    function ensureStartUp2Exam() {
        if(utils.isAppStartUp()) {
            utils.setDirLocal(0);
        }
    }

    /**
     * 启动界面背景 与 游戏背景 不一样
     */
    (function toggleBgImg() {
        if (!utils.isOnResumeUpdate()) {
            var img = utils.getBgImage();
            img.attr("src", utils.isAppStartUp() ? CST.BG_IMG_STARTUP : CST.BG_IMG_GAME);
            img.show();
        }
    })();


    /**
     * 判断自动更新的文件内容是否存在
     * @param  {[type]}  argument [description]
     * @return {Boolean}          [description]
     */
    function isUpdaterDirExist(callback) {
        isDirExist(CST.MANIFEST_UPDATER_DIR + CST.MANIFEST_FILE_NAME, callback);
    }

    /**
     * 判断作业端的文件内容是否存在
     * @param  {Function} callback [description]
     * @return {Boolean}           [description]
     */
    function isExamDirExist(callback) {
        isDirExist(CST.MANIFEST_LOCAL_DIR + CST.MANIFEST_FILE_NAME, callback);
    }

    function isDirExist(dirName, callback) {
        new DownloadApp().isFileExist(dirName, function(entry) {
            typeof callback === "function" && callback(null, {isExist: true});
        }, function(error) {
            typeof callback === "function" && callback(error, {isExist: false});
        });
    }
    
    /**
     * 初始化或上传统计数据
     * @return {[type]} [description]
     */
    function handleStatis() {
        if(utils.isOnResumeUpdate()) {
            Statis.uploadStatis(CST.URL_UPDATE_STATIS);
        } else {
            Statis.initStatisData();
        }
    }

    window.setTimeout(checkDeviceReadyFail, 5000);
//}());

module.exports.init = onDeviceReady