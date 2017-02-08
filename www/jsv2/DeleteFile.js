/**
 * DeleteFile.js
 */


	var logger = require("./Logger"),
		DownloadApp = require("./DownloadApp"),
		utils = require("./Utils"),
		CST = require("./Const").CST;

	/**
	 * 删除文件
	 */
	function deleteFiles(file, dir) {
		var that = this,
			files = file.split("/"),
			App = new DownloadApp(),
			fileName = files.pop(),
			folderName = (dir || '') + files.join('/');

		folderName += folderName.match(/\/$/) ? '' : '/';
		App.del(folderName, fileName, function() {
			global.filesDelete.shift();
			utils.updateProgressBar(CST.PROGRESS_TYPE.DELETING);
			logger('success delete ' + fileName + '&nbsp; ' + (global.totalDelete - global.filesDelete.length) + '/' + global.totalDelete, 'success');
			$("#btnLoad").trigger("click");
		}, function() {
			global.filesDelete.shift();
			utils.updateProgressBar(CST.PROGRESS_TYPE.DELETING);
			logger('fail delete ' + fileName, 'fail, skipped!');
			$("#btnLoad").trigger("click");
		});
	}

	module.exports = deleteFiles;
