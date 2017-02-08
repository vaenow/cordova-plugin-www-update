/**
 * DownloadFile.js
 */


	var constants = require("./Const"),
		logger = require("./Logger"),
		DownloadApp = require("./DownloadApp"),
		XHR = require("./XHR"),
		msgBox = require("./MsgBox"),
		utils = require("./Utils");


	var CST = constants.CST,
		getRandomInt = utils.getRandomInt;


	/**
	 * 下载文件
	 * @param file
	 * @param dir
	 */
	function download(file, dir) {
		var that = this,
			paths = file.split("/"),
			fileName = paths.pop(),
			App = new DownloadApp(),
			/*
			// 之前初始化作业端时，需要从www/里解压到mathgames0/ 
			// 现在不需要了
			// added by LuoWen on 20160523
			uri = utils.isAppJustInstall() && utils.isAppStartUp()
					? utils.getAssetPath() + file
					: CST.URL_REMOTE_RESOURCE + CST.DIR_REMOTE + file,*/
			// 如果需要移除www/里面的 zipSourceFile.zip，可以把注释去掉。
			uri = CST.URL_REMOTE_RESOURCE + CST.DIR_REMOTE + file,
			folderName = (dir || '') //+ paths.join('/'); //For Unzip

		Statis.initFileInfo(); //统计：初始化一个文件信息
		Statis.startFIStartTime(); //统计：开始计算单个文件
		Statis.setFIFileName(fileName); //统计：添加文件名
		Statis.setFIFileSize(global.filesInfo[fileName].size || -1); //统计：添加文件大小
		Statis.setFIVersion(global.filesInfo[fileName].longVersion || -1)  //统计：添加文件版本

		App.load(uri, folderName, fileName,
			/*progress*/
			downloadProgress,
			/*success*/
			checkFileExist,
			/*fail*/
			downloadFail
		);

		function checkFileExist(entry) {
			App.isFileExist(entry.fullPath, downloadSuccess, downloadFail);
		}

		function downloadSuccess(entry) {
				Statis.endFIEndTime();

			//if (global.filesAdd.length) {
				global.filesAdd.shift();
				utils.updateProgressBar(CST.PROGRESS_TYPE.DOWNLOADING);
				logger('load ' + entry.toURL() + '&nbsp; ' + (global.totalAdd - global.filesAdd.length) + '/' + global.totalAdd, 'success');
				if (global.isLoading) { //如果模态框显示
					var App = new DownloadApp();
					App.unzip(fileName, folderName, unzipSuccess, unzipFail, unzipProgress)
				}
			//} else if (utils.isResourcesNeedCheck()) {
			//	beforeCheckCompletion();
			//} else {
			//	logger(entry.name + ' updated! <hr>');
			//}
		}

		function downloadFail(error) {
			Statis.increaseFIErrorTimes();

			msgBox.confirm(CST.DOWNLOAD_FAIL_TEXT, function(){
				/*utils.showProgressModal(false);
				$("#btnLoad").trigger('click');*/
				window.location.reload(); //下载错误，刷新重试
			}, CST.DOWNLOAD_FAIL_TITLE, [CST.DOWNLOAD_FAIL_BTN_YES]);

			/*var randSec = getRandomInt(5, 2);
			logger('load ' + fileName, 'fail');
			logger('重试中... ' + randSec + 's');
			setTimeout(function() {
				$("#btnLoad").trigger('click');
			}, randSec * 1000);*/
		}

		function downloadProgress(percentage) {
			//console.log(percentage, "%");
			utils.updateProgressBar(CST.PROGRESS_TYPE.DOWNLOADING, percentage);
		}

		function unzipProgress() {
			utils.updateProgressBar(CST.PROGRESS_TYPE.UNZIPPING);
		}

		function unzipSuccess() {
			Statis.setFICanUnzip(true);

			logger("unzip success!");
			setDeleteFileList(fileName);
		}

		function unzipFail() {
			Statis.setFICanUnzip(false);

			window.location.reload(); //解压错误，刷新重试
			logger("unzip Fail");
		}
	}

	/**
	 * 设置需要删除的文件列表
	 */
	function setDeleteFileList(zipFile) {
		global.filesDelete.push(zipFile); //需要删除下载好的zip文件

		XHR(CST.MANIFEST_LOCAL_DEL, _doneManifestLocal, _failManifestLocal, _loadNext);

		function _doneManifestLocal(data) {
			global.filesDelete = global.filesDelete
				.concat(CST.MANIFEST_FILE_NAME_DEL) //需要删除解压出来的 manifestDel.json
				.concat(Object.keys(data.files));
		}

		function _failManifestLocal() {
			logger('manifestDel.json dose NOT exist!', 'fail');
		}

		function _loadNext() {
			global.totalDelete = global.filesDelete.length;
			$("#btnLoad").trigger("click"); //继续加载下一个文件
		}
	}

	function beforeCheckCompletion() {
		//onDeviceReady(); //Restart!
		window.location.reload();
	}
	
	module.exports = download;
