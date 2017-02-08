/**
 * Utils.js
 */

	// body...
	var config = require('./Config'),
		urlParams = require('./UrlParams');

	function getRandomInt(end, start) {
		return (Math.random() * (end - (start || 0)) + (start || 0)) | 0;
	}

	/**
	 * 资源文件是否需要检查
	 *
	 * 如果刚刚下载过新版本，现在就需要检查资源完整性
	 *
	 * @param  {Boolean} isNeedCheck [description]
	 * @return {Boolean}             [description]
	 */
	function isResourcesNeedCheck(isNeedCheck) {
		var key = "isNeedCheck";
		var ret;
		if (isNeedCheck !== undefined) {
			ret = window.localStorage.setItem(key, !!isNeedCheck ? 1 : "");
		} else {
			ret = window.localStorage.getItem(key);
		}

		return !!ret;
	}

	/**
	 * 更新进度条
	 */
	function updateProgressBar(progressType, progress) {

        if (progress) {
            var totalProgress = 100;
            var filesAddNum = global.totalAdd - global.filesAdd.length;
            var totalProgressOk = progress * getCurrentFileRate(filesAddNum) +
                totalProgress * getTotalFileRate(filesAddNum);

            var _p = ((totalProgressOk / totalProgress) * 100).toFixed(1) + '%';

            
            showDownloadSpeed(totalProgressOk); //显示标签下载速率
            // var remainSize = showRemainSize(totalProgressOk); //剩余大小
            // var remainTime = showRemainTime(totalProgressOk, speed); //剩余时间
            // speed && $("#myModalSpeed").html(formatSpeed(speed) + " " + formatData(remainSize) + " " + speed + " " + remainTime);
            // speed && $("#myModalSpeed").html(formatSpeed(speed));
            //把最后100%固定替换为 99%
            $(".progress>div").css('width', _p).html(_p.replace(/100/, 99));
        }

        if (progressType && progressType !== window.progressTypeDoing) {
            window.progressTypeDoing = progressType;
            $("#myModalLabel").html(progressType);
        }

        /**
         * 剩余时间
         * @param  {[type]} totalProgressOk [description]
         * @param  {[type]} speed           [description]
         * @return {[type]}                 [description]
         */
        function showRemainTime(totalProgressOk, speed) {
            var remainSize = showRemainSize(totalProgressOk);
            return remainSize / speed;
        }

        /**
         * 剩余大小
         * @param  {[type]} totalProgressOk [description]
         * @return {[type]}                 [description]
         */
        function showRemainSize(totalProgressOk) {
            var dl = global.dl;
            var remainSize = (100 - totalProgressOk) / 100 * dl.totalSize;
            return remainSize;
        }

        /**
         * 显示下载
         */
        function showDownloadSpeed(totalProgressOk) {
            global.totalProgressOk = totalProgressOk;

            if(global.showingDownloadSpeed) return;
            global.showingDownloadSpeed = true;
            window.setInterval(function(){
                var speed = getDownloadSpeed();
                speed != undefined && $("#myModalSpeed").html(formatSpeed(speed));
            }, 1000);
        }

        /**
         * 获取下载
         * @return {[type]} [description]
         */
        function getDownloadSpeed() {
            var now = new Date().getTime();
            var dl, timeGap, progressGap, speed = 0;
            var MAX_IDLE_TIME = 4;
            var MIN_PROGRESS_GAP = 0.0001;
            var MIN_TIME_GAP = 1;

            if(!global.dl) global.dl = {};
            dl = global.dl;

            //set time2 & progress2
            dl.time2 = now;
            dl.progress2 = global.totalProgressOk;

            //cache total size
            if(!dl.totalSize) dl.totalSize = getTotalFileSize();

            //calc the speed
            if(dl.time1) {
                timeGap = (dl.time2 - dl.time1) / 1000;
                if(timeGap < MIN_TIME_GAP) return; //每秒刷新一次速率

                progressGap = dl.progress2 - dl.progress1;
                if (progressGap <= MIN_PROGRESS_GAP && timeGap > MAX_IDLE_TIME) return speed;
                if (progressGap <= MIN_PROGRESS_GAP) return; //有下载后，才更新进度条

                speed = (progressGap / 100 * dl.totalSize) / timeGap;
            }

            //swap time & progress
            dl.time1 = dl.time2;
            dl.progress1 = dl.progress2;

            return speed;
        }

        function formatData(chunk) {
            var K = 1024;
            if (chunk < K) {
                chunk = chunk + "B";
            } else if (chunk >= K && chunk < K * K) {
                chunk = (chunk / K).toFixed(2) + "K";
            } else if (chunk >= K * K && chunk < K * K * K) {
                chunk = (chunk / K / K).toFixed(2) + "M";
            } else if (chunk >= K * K * K) {
                chunk = (chunk / K / K / K).toFixed(2) + "G";
            }
            return chunk;
        }

        function formatSpeed(speed) {
            return (speed === 0)
                ? "..."
                : formatData(speed) + "/s";
         }

        /**
         * 已下载的所有文件的大小比例
         * @return {[type]} [description]
         */
        function getTotalFileRate(filesAddNum) {
            var totalFileRate = 0;
            for (var i = 0; i < filesAddNum; i++) {
                totalFileRate += getCurrentFileRate(i);
            }
            return totalFileRate;
        }

        /**
         * 当前下载文件的大小比例
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        function getCurrentFileRate(index) {
            var fileNameKeys = Object.keys(global.filesInfo);
            var fi = global.filesInfo[fileNameKeys[index]];

            if (!fi.fileRate) fi.fileRate = fi.size / getTotalFileSize();

            return fi.fileRate;
        }

        /**
         * 总文件大小
         * @return {[type]} [description]
         */
        function getTotalFileSize() {
            var totalSize = 0;
            for (var fileName in global.filesInfo) {
                totalSize += global.filesInfo[fileName].size;
            }
            return totalSize;
        }
	}

	/**
	 * 是否iOS平台
	 */
	function isPlatformIOS() {
		return window.device && window.device.platform.match(/ios/i);
	}

	/**
	 * 是否Android平台
	 */
	function isPlatformAndroid() {
		return window.device && window.device.platform.match(/android/i);
	}

	/**
	 * 更新的文件夹位置
	 * @param  {[type]} CST [description]
	 * @return {[type]}     [description]
	 */
	function getDirLocal(CST) {
		var dirLocal = window.localStorage.getItem('dirLocal');
		if (dirLocal === null || dirLocal === undefined) {
			dirLocal = CST.DEFAULT_DIR_LOCAL; // 0 默认进入学习圈
		} else if (dirLocal == '1') {
			dirLocal = ""; // '' for grade 1
		}
		//if(window.isNaN(String(dirLocal)) || dirLocal == '1') dirLocal = ''; // '' for grade 1
		return dirLocal;
	}

	/**
	 * 设置DirLocal代码
	 *  <pre>
	 *      0 : 学生
	 *      1 : 一年级
	 *      2 : 二年级
	 *      3 : 三年级
	 *  </pre>
	 * @param code
 	*/
	function setDirLocal(code) {
		if(isNaN(code)) {
			console.error("传入参数应该为 Int");
			return;
		}

		if(code == 1) code = "";
		window.localStorage.setItem('dirLocal', code);
	}

	/**
	 * 获取年级编号
	 * @param CST
	 */
	function getDirGradeNum(CST) {
		var num = getDirLocal(CST);
		return num === "" ? num = "1" : num;
	}

	/**
	 * 更新的文件夹后缀
	 * @param  {[type]} CST [description]
	 * @return {[type]}     [description]
	 */
	function getDirSuffix(CST) {
		var dir = "";

		if(isPlatformIOS()){
			dir += "_ios";
		}

		if (config.isClientStudent()) {
			dir += getDirLocal(CST);
		} else if (config.isClientParent()) {
			dir += "_p";
		} else if (config.isClientTeacher()) {
			dir += "_t";
		}

		return dir + '/';
	}

    /**
     * 获取相应平台的URL前缀
     * @return {[type]} [description]
     */
    function getURLPrefix() {
        var urlPrefix;

        if (isPlatformIOS()) {
            urlPrefix = cordova.file.dataDirectory;
            //urlPrefix = "http://localhost:12345/Documents/";
        } else if (isPlatformAndroid()) {
            urlPrefix = cordova.file.dataDirectory;
        } else {
            console.error("未知的运行平台");
        }
        return urlPrefix;
    }

    /**
     * 获取相应平台的文件系统代码
     * @return {[type]} [description]
     */
    function getFSDependOnPlatform() {
        var platformCode;

        if (isPlatformIOS()) {
            platformCode = 4;
        } else if (isPlatformAndroid()) {
            platformCode = 4;
        } else {
            console.error("未知的运行平台");
        }
        return platformCode;
    }

	/**
	 * 是否跳转至内置内容
	 * @param  {[type]} manifestData [description]
	 * @return {[type]}              [description]
	 */
	function isRedirectToBuildin(manifestData) {
		var buildinVersions = manifestData && manifestData.buildin || [];
		var version = window.AppVersion && window.AppVersion.version;

		var isRedirect = version && buildinVersions.indexOf(version) !== -1;
		if(isRedirect) {
			window.location.href = config.getBuildinUrl();
		}

		return isRedirect;
	}

    /**
     * 在更新范围外，size就会为零
     * @return {Boolean} [description]
     */
    function isOnResumeUpdate() {
        return getBgImage().size() === 0;
    }

	/**
	 * 取得背景图片
	 */
	function getBgImage() {
		return $('.loadingScene > div > img').first();
	}

	/**
	 * 设置跨平台的资源路径
	 */
	function setAssetPath() {
		if(isAppStartUp()) {
			window.localStorage.setItem("assetPath", JSON.stringify({
                url: window.location.href.replace(/index\.html\?.*?$/, '') //存储时，删除 urlParams
            }));
		}
	}

	/**
	 * 获取跨平台的资源路径
	 */
	function getAssetPath() {
		return JSON.parse(window.localStorage.getItem("assetPath")).url;
	}

	/**
	 * 获取跨平台的资源路径
	 */
	function getAssetPathIndex() {
		return getAssetPath() + 'index.html';
	}

    ///**
    // * iOS用于作业跳转游戏
    // * @return {[type]} [description]
    // * @deprecated
    // */
    //function setAssetPath4IOS() {
    //    if (!isOnResumeUpdate() && isPlatformIOS()) {
    //        window.localStorage.setItem("iosAssetPath", JSON.stringify({
    //            url: window.location.href.replace(/\?.*?$/, '') //存储时，删除 urlParams
    //        }));
    //    }
    //}
    //
    ///**
    // * iOS用于作业跳转游戏
    // * @return {[type]} [description]
    // * @deprecated
    // */
    //function getAssetPath4IOS() {
    //    if (isPlatformIOS()) {
    //        return JSON.parse(window.localStorage.getItem("iosAssetPath")).url;
    //    }
    //}

    /**
     * OnResumeUpdate的情况下，只加载一次
     * @return {[type]} [description]
     */
    function isLoadOnceOnResumeUpdate() {
		return isOnResumeUpdate() && window.isLoadedOnce;
    }

	/**
	 * 获取远程调用的方法参数
	 */
	function getUrlRemoteParams(param) {
		var urlParam = '';

		Object.keys(param).forEach(function(key){
			urlParam += '&' + key + "=" + param[key];
		});

		return urlParam.replace(/^&/, '?');
	}

	/**
	 * 获取平台名字
	 */
	function getPlatformName() {
		var platform;
		if(isPlatformIOS()) platform = "ios";
		else if(isPlatformAndroid()) platform = "android";
		else console.error("未识别的平台");

		return platform;
	}

/**
	 * 判断类型名字
	 * @param val
	 * @returns {string}
	 */
	function typeName(val) {
		return Object.prototype.toString.call(val).slice(8, -1);
	}
	/**
	 * 判断数组
	 * @param a
	 * @returns {boolean}
	 */
	function isArray(a) {
		return typeName(a) === 'Array';
	}

	/**
	 * 判断字符串
	 * @param s
	 * @returns {boolean}
	 */
	function isString(s) {
		return typeName(s) === 'String';
	}

    /**
     * App应用是否为 点击图标App启动 (20160517 点击图标启动状态改为 toupdater)
     */
    function isAppToUpdater() {
        return !isOnResumeUpdate() && urlParams.action && urlParams.action === "toupdater";
    }

	/**
	 * App应用是否为 点击图标App启动 (20160517 startup已改为 toupdater -> startup)
	 */
	function isAppStartUp() {
		return !isOnResumeUpdate() && urlParams.action && urlParams.action === "startup";
	}

    /**
     * App应用是否为 刚刚下载
     * @return {Boolean} [description]
     */
    function isAppJustInstall() {
        return (window.global && window.global.isAppJustInstall) || urlParams.action && urlParams.action === "justInstall";
    }

    /**
     * 通过OnResumeUpdate跳转过来的更新操作
     * @return {Boolean} [description]
     */
    function isOnResumeDirect2Update(CST) {
        return !isOnResumeUpdate() && urlParams.action && urlParams.action == CST.ONRESUME_DIRECT_UPDATE;
    }

	/**
	 * 设置显示模态框
	 * @param isShow
	 */
    function showProgressModal(isShow) {
        /*$('#progressModal').modal({
            show: isShow || true,
            backdrop: false
        });*/
        var progress = $('#progressContainer');
        if(isShow === undefined) isShow = true;
        isShow ? progress.show() : progress.hide();
    }

    /**
     * 用于学习端更新时，区分老师，学生，家长，分开更新
     * @return {[type]} [description]
     */
    function getCurrentSystem() {
        var roleType = "";
        var currentSystem = window.localStorage.getItem('currentSystem');

        if (currentSystem) {
            try {
                roleType = JSON.parse(currentSystem).id[0];
            } catch (e) {
                console.error("roleType error", roleType);
            }
        }

        return roleType;
    }

    /**
     * 获取APP的版本号
     * @return {[type]} [description]
     */
    function getAppVersion() {
        return AppVersion && AppVersion.version;
    }

    /**
     * 获取APP资源更新前的版本号
     * @return {[type]} [description]
     */
    function getAppVersionResFrom() {
        return global.localManifestVersion;
    }

    /**
     * 获取APP资源更新后的版本号
     * @return {[type]} [description]
     */
    function getAppVersionResTo(fileName) {
    	return +fileName.match(/\d{12}/);
    }

    /**
     * 获取当前场景存储的SVN版本
     * @return {[type]} [description]
     */
    function getAppRev() {
        return global.localManifestRev;
    }

    /**
     * 设置日志
     */
    function setChangeLog(fileName) {
        var templ = {
            dt: new Date().toISOString(),
            version: getAppVersionResFrom() + "-" + getAppVersionResTo(fileName),
            rev: getAppRev(),
            dir: getDirLocal(),
            role: getCurrentSystem(),
        };
        var changeLog = getChangeLog().slice(0, 20);
        changeLog.unshift(templ);
        window.localStorage.setItem('change_log', JSON.stringify(changeLog));

        return changeLog;
    }

    /**
     * 获取日志
     * @return {[type]} [description]
     */
    function getChangeLog() {
        var changeLog = window.localStorage.getItem('change_log');
        try {
            changeLog = JSON.parse(changeLog);
            if(!isArray(changeLog)) throw new error();
        } catch (e) {
            console.error("fetch changeLog error", changeLog);
            changeLog = [];
        }
        return changeLog || [];
    }

    /**
     * 显示日志
     * @return {[type]} [description]
     */
    function showChangeLog() {
    	var changeLog = getChangeLog();
    	isArray(changeLog) && changeLog.forEach(function (val) {
    		console.log(val);
    	});
    }

    /**
     * 是否前往游戏
     * @return {Boolean} [description]
     */
    function isToGame(CST) {
        return getDirLocal(CST) != '0';
    }

    /**
     * 启动后台应用刷新
     * @return {[type]} [description]
     */
    function startBackgroundFetch() {
        var Fetcher = window.plugins && window.plugins.backgroundFetch;
        if(!Fetcher) return;

        // Your background-fetch handler.
        var fetchCallback = function() {
            console.log('BackgroundFetch initiated');
            window.plugin.notification.local.add({ message: 'Just fetched!' }); //local notification

            // perform your ajax request to server here
            // $.get({
            //     url: '/heartbeat.json',
            //     callback: function(response) {
            //         // process your response and whatnot.

            //         Fetcher.finish(); // <-- N.B. You MUST called #finish so that native-side can signal completion of the background-thread to the os.
            //     }
            // });
        }
        Fetcher.configure(fetchCallback);
    }

    /**
     * 结束后台应用刷新
     * @return {[type]} [description]
     */
    function stopBackgroundFetch() {
        // <-- N.B. You MUST called #finish so that native-side can signal completion of the background-thread to the os.
        window.plugins && window.plugins.backgroundFetch.finish(); 
    }

    /**
     * 文件名是否包含协议 file:/// http:///
     * @param  {[type]}  filePath [description]
     * @return {Boolean}          [description]
     */
    function isPathContainProtocol(filePath) {
        return filePath.match(/:\/\//);
    }

    /**
     * 获取Version.xml文件名称
     * @return {[type]} [description]
     */
    function getVersionFileName() {
        var appArch = window.AppArch,
            FILE_DEFAULT = "version_release.xml",
            FILE_DEFAULT_DEBUG = "version.xml",
            fileName;

        FILE_DEFAULT = !!config.IS_DEBUG 
            ? FILE_DEFAULT_DEBUG
            : FILE_DEFAULT;

        if(!appArch  //AppArch 不存在时
            || appArch.isArchArmv7) { // armv7时
            fileName = FILE_DEFAULT;
        } else if(appArch.isArchX86) { // x86时
            fileName = "version_release_x86.xml";
        } else {
            fileName = FILE_DEFAULT;
        }

        return fileName;
    }

    function getSysTpe() {
        return !!config.IS_TEMP_UPLOAD
            ? "TEMP_UPLOAD"
            : "AS20151231-LU";
    }

    function isUsingPRD(){
        return !!window.PRD && config.IS_USING_PRD;
    }

	module.exports = {
		getRandomInt: getRandomInt
        , getAppRev: getAppRev
        , getBgImage: getBgImage
        , getChangeLog: getChangeLog
        , getDirSuffix: getDirSuffix
        , getAssetPath: getAssetPath
        , getURLPrefix: getURLPrefix
        , getAppVersion: getAppVersion
        , getDirGradeNum: getDirGradeNum
        , getPlatformName: getPlatformName
        , getCurrentSystem: getCurrentSystem
        , getAssetPathIndex: getAssetPathIndex
        , getUrlRemoteParams: getUrlRemoteParams
        , getFSDependOnPlatform: getFSDependOnPlatform
        , isArray: isArray
        , isToGame: isToGame
        , isString: isString
        , isAppStartUp: isAppStartUp
        , isPlatformIOS: isPlatformIOS
        , isAppToUpdater: isAppToUpdater
        , isOnResumeUpdate: isOnResumeUpdate
        , isAppJustInstall: isAppJustInstall
        , isPlatformAndroid: isPlatformAndroid
        , isRedirectToBuildin: isRedirectToBuildin
        , isResourcesNeedCheck: isResourcesNeedCheck
        , isPathContainProtocol: isPathContainProtocol
        , isOnResumeDirect2Update: isOnResumeDirect2Update
        , isLoadOnceOnResumeUpdate: isLoadOnceOnResumeUpdate
        , setDirLocal: setDirLocal
        , setAssetPath: setAssetPath
        , setChangeLog: setChangeLog
        , showChangeLog: showChangeLog
        , showProgressModal: showProgressModal
        , startBackgroundFetch: startBackgroundFetch
        , stopBackgroundFetch: stopBackgroundFetch
        , updateProgressBar: updateProgressBar
        , getVersionFileName: getVersionFileName
        , getSysTpe: getSysTpe
        , isUsingPRD: isUsingPRD
	};
