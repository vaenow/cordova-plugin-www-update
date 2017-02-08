/**
 * CheckVersion.js
 */

	
	var constants = require("./Const"),
		XHR = require("./XHR"),
		logger = require("./Logger"),
		DownloadApp = require("./DownloadApp"),
		notification = require("./Notification"),
		msgBox = require("./MsgBox"),
		utils = require("./Utils");


	var ALL_DONE = 2;

	var CST = constants.CST,
		initConstants = constants.initConstants,
		getRandomInt = utils.getRandomInt;


	function initVariables() {
		window.global = {};

		global.times = 0;
		global.manifestData = {};
		global.manifestDataOld = {};
		global.filesDelete = [];
		global.filesAdd = [];
		global.filesSame = [];
		global.filesInfo = {};
		global.totalAdd = 0;
		global.totalDelete = 0;
		global.totalProgress = 0;
		global.totalCheckCompletation = 0;
		global.totalCheckCompletationOk = 0;
		global.isLoading = true;
		global.progressTypeDoing = "";
		global.hasFileNotExist = false;
		global.localManifestVersion = "0";
		global.localManifestRev = "0";
		global.isAppJustInstall = false;
	}

	/**
	 * 向服务器检查最新版本
	 */
	function checkVersion() {
		initVariables(); // init variables
		getLocalManifest();
	}

	function getLocalManifest() {
		XHR(CST.MANIFEST_LOCAL, _doneManifestLocal, _failManifestLocal);

		function _doneManifestLocal(data) {
			global.localManifestVersion = data.versionCode || global.localManifestVersion;
			global.localManifestRev = data.rev || global.localManifestRev;

			getRemoteManifest();
		}

		function _failManifestLocal(data) {
			logger('old manifest.json dose not exsit!', false);
			
			//解压Zip，只适用于作业端
			if (!utils.isToGame()) { 
				logger('Unzip buildin zip file!', false);
				global.isAppJustInstall = true;
				constants.handleInstallConst(CST); //首次安装的文字提示
				//unzipBuildFile();
				getRemoteManifest();
			} else {
				getRemoteManifest();
			}
		}
	}

	function getRemoteManifest() {
		var param = {
			platform: utils.getPlatformName(),
			sysType: utils.getSysTpe(),
			version: global.localManifestVersion,
			gradeNum: utils.getDirGradeNum(CST),
			tag: utils.getCurrentSystem(),
			type:"p"
		};
		var xhrPending = true;

		handleNetworkStatus();
		XHR(CST.ZIP_LIST_REMOTE + utils.getUrlRemoteParams(param), _doneManifestRemote, _failManifestRemote);

		function _doneManifestRemote(data) {
			xhrPending = false; //xhr 执行完毕

			if(!utils.isOnResumeUpdate() && utils.isRedirectToBuildin(data)) return;
			handleZips(data);
		}

		function _failManifestRemote(data) {
			xhrPending = false; //xhr 执行完毕

			//showMsgToast(CST.NETWORK_ERROR); // 30s后显示网络传输失败
			showRetryDialog();
		}

		function handleNetworkStatus() {
			setTimeout(function() {
				// xhrPending && showMsgToast(CST.NETWORK_ERROR_TRANSFERING); // 6s后显示网络传输中...
                xhrPending && showCheckingLayout(); //6s后,显示"正在检查更新的布局"
			}, 6 * 1000);
		}

		function showMsgToast(msg) {
			if(window.plugins && window.plugins.toast && window.plugins.toast.showLongCenter)
				window.plugins.toast.showLongTop(msg);
			else window.alert(msg);
		}

		function showRetryDialog() {
			if(utils.isOnResumeUpdate()) return; //作业界面不显示重试框

			var configMsg = navigator.onLine 
				? CST.NETWORK_ERROR_RETRY_MSG
				: CST.DOWNLOAD_FAIL_TEXT;

			msgBox.confirm(configMsg, function() {
				window.location.reload();  //手动重试
			}, null, [CST.NETWORK_ERROR_RETRY_BTN]);

		}
        
        function showCheckingLayout() {
            $("#myModalLabel").html(CST.OFFLINE_CHECKING_MSG_1);

        }
	}

	function unzipBuildFile() {
		var data = {
			"numOfUpdates": 1,
			"updates": [{
				"url": CST.ZIP_SOURCE_FILE,
				"size": 15 * 1024 * 1024,
				"type": "i"
			}]
		};
		handleZips(data);
	}

	function handleZips(data) {

		data.updates.forEach(function(zip){
			global.filesAdd.push(zip.url);
			global.filesInfo[zip.url.replace(/.*\//, '')] = zip;  // filename : fileinfo
			if(zip.type === 'i' && utils.getDirSuffix() === "0") global.isNeedDelDir = !0;
		});

		/** 记录总数 */
		global.totalAdd = global.filesAdd.length;
		global.totalDelete = global.filesDelete.length;
		//getAnalyzeNum();

		var needUpdate = !!(global.totalAdd || global.totalDelete);

		if (utils.isOnResumeUpdate()) {
			require("./CheckUpdateOnResume").handleOutOfUpdateScale(needUpdate);
			return;
		}

		if (needUpdate) {
			(!utils.isAppJustInstall()
				&& (utils.isAppStartUp() 
					|| !utils.isOnResumeDirect2Update(CST))
				&& !utils.isAppToUpdater())
				? msgBox.confirm(CST.RESOUCES_NEED_UPDATE, onConfirmClick)
				: onConfirmClick();  //不弹框直接下载
		} else {
			$("#run").trigger('click');
		}
	}

	function onConfirmClick() {
		logger('检查到需要更新， 3 秒后自动处理...');

		global.isLoading = true;
		notification.watching();

		setTimeout(function () {
			Statis.startTime(); //统计：开始计算 总的下载时间
			Statis.setDir(utils.getDirGradeNum());
			Statis.setLocalVersion(global.localManifestVersion);
			Statis.setCdnIp(CST.URL_REMOTE_RESOURCE); //获取CDN的IP, 需要一定延时
			Statis.setPlatform(utils.getPlatformName()); //获取平台名称
			Statis.setDeviceUUID(window.device && window.device.uuid); //获取设备的UUID
			Statis.setUserAgent(window.navigator && window.navigator.userAgent || ""); //获取UserAgent

			utils.isResourcesNeedCheck(true);
			$("#btnLoad").trigger('click');
		}, 300);
	}

	/*function getAnalyzeNum() {
		//需要检查资源完整的总数
		totalCheckCompletation = getTotalCheckCompletationNum();
		//用于进度条，记录总数+检查所有资源
		totalProgress = totalAdd + totalDelete + totalCheckCompletation;
	}*/

	function getTotalCheckCompletationNum() {
		var num = 0;
		if (utils.isResourcesNeedCheck()) {
			num = Object.keys(window.manifestDataOld.files).length;
		}

		return num;
	}

	/**
	 * 检查资源完整性
	 * @param evt
	 * @param data
	 * @deprecated
	 */
	function checkCompletion(evt, data) {
		var manifestDataOld = data.m;
		var checkDiffFn = data.c;
		var App = new DownloadApp();
		var fileURL = manifestDataOldFiles.pop();
		
		var updateProgressBarType = getUpdateProgressBarType();

		if (fileURL) {
			App.isFileExist(CST.DIR_LOCAL + fileURL, function() {
				upb(data);
			}, function() {
				window.hasFileNotExist = true;
				delete manifestDataOld.files[fileURL];
				upb(data);
			});
		} else {
			utils.isResourcesNeedCheck(false);
			if (console && console.time) console.timeEnd(CST.TIMER_CHECK_COMPLETION);
			utils.updateProgressBar(updateProgressBarType);
			window.totalCheckCompletationOk = 0; //重置计数
			typeof checkDiffFn === 'function' && checkDiffFn.call(window);
		}

		function upb(data) {
			window.totalCheckCompletationOk = window.totalCheckCompletationOk || 0;
			
			if (!(++window.totalCheckCompletationOk % 10)) 
				utils.updateProgressBar(updateProgressBarType);

			$(document).trigger(CST.CHECK_COMPLETION_EVENT, data);	
		}

		function getUpdateProgressBarType() {
			var type = CST.PROGRESS_TYPE.CHECKING;
			if(window.hasFileNotExist) {
				type = CST.PROGRESS_TYPE.CHECKING_AGAIN;
			}
			return type;
		}
	}

	/**
	 * 新版 检查资源完整性，加速资源完整性检查
	 * @param data
	 */
	function checkCompletionV2(data) {
		if (console && console.time) console.time(CST.TIMER_CHECK_COMPLETION_V2);
		var manifestDataOld = data.m;
		var checkDiffFn = data.c;

		var app = new DownloadApp();
		app.fetchAllFiles(CST.DIR_LOCAL, function(allFiles) {
			var fileURL;
			var found; //是否存在本地文件

			//开始检查
			if (console && console.time) console.time(CST.TIMER_VERSION_COMPARE_L2L);
			while (fileURL = window.manifestDataOldFiles.pop()) {
				found = false;
				for (var len = allFiles.length - 1; len > 0; len--) {
					if (allFiles[len] === "/" + CST.DIR_LOCAL + fileURL) { //如果文件存在，则继续循环
						found = true;
						allFiles.splice(len, 1);
						break;
					}
				}
				if (!found) {
					delete manifestDataOld.files[fileURL]; //如果文件不存在，则删除记录，重新下载
				}
			}

			if (console && console.time) console.timeEnd(CST.TIMER_VERSION_COMPARE_L2L);
			if (console && console.time) console.timeEnd(CST.TIMER_CHECK_COMPLETION_V2);
			//检查完毕
			typeof checkDiffFn === 'function' && checkDiffFn.call(window);

		}, this)

	}

	/**
	 * 重置游戏资源
	 */
	function resetResources() {
		if (!confirm('确定要重置资源吗？')) return;

		new DownloadApp().delDir(CST.MANIFEST_LOCAL_DIR, function() {
			logger('Reset success!', 'success');
		}, function() {
			logger('Reset fail!', 'fail');
		}, true);
	}

	module.exports = {
		checkVersion: checkVersion
		, checkCompletion: checkCompletion
		, checkCompletionV2: checkCompletionV2
		, resetResources: resetResources
	}

