/**
 * Load.js
 */


	var CST = require("./Const").CST,
		logger = require("./Logger"),
		download = require("./DownloadFile"),
		delDir = require("./DeleteDir"),
		utils = require("./Utils"),
		deleteFiles = require("./DeleteFile");


	function load() {
		var filesAdd = global.filesAdd,
			filesDelete = global.filesDelete;
		
		//如果是安装包，则需要先把之前的内容清理之后，再解压安装
		if(global.isNeedDelDir) {
			delDir(CST.MANIFEST_LOCAL_DIR);
			global.isNeedDelDir = false;
		} else if (!!filesDelete.length) {
			deleteFiles(filesDelete[0], CST.MANIFEST_LOCAL_DIR);
		} else if (!!filesAdd.length) {
			utils.setChangeLog(filesAdd[0]);
			download(filesAdd[0], CST.MANIFEST_LOCAL_DIR);
		} else if (utils.isAppJustInstall()) {
			Statis.endTime(true); //统计：结束计算 总的下载时间

			window.location.href = utils.getAssetPathIndex() + "?action=justInstall";
		} else {
			Statis.endTime(true); //统计：结束计算 总的下载时间

			global.isLoading = false;
			//logger(global.totalAdd + 'files success!', 'success');
			//download(CST.MANIFEST_FILE_NAME, CST.MANIFEST_LOCAL_DIR)
			logger("文件更新完毕，自动进入游戏...");
			//setTimeout(function() {
				$("#run").trigger('click');
			//}, 3000);
		}
	}

	module.exports = load;
