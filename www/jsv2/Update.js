/**
 * Update.js
 */

	var constants = require("./Const"),
		logger = require("./Logger"),
		load = require("./Load"),
		utils = require("./Utils"),
		DownloadApp = require("./DownloadApp"),
		_checkVersion = require("./CheckVersion");

	var CST = constants.CST,
		initConstants = constants.initConstants,
		checkCompletionV2 = _checkVersion.checkCompletionV2;


	function registerHandlers() {
		if(utils.isLoadOnceOnResumeUpdate()) return;

		$("#check").on("click", _checkVersion.checkVersion);
		$("#btnLoad").on("click", load);
		$("#reset").on('click', _checkVersion.resetResources);
		$("#run").on('click', handleRunGame);
		$(document).on(CST.CHECK_COMPLETION_EVENT, _checkVersion.checkCompletion);
	}

	function handleRunGame() {
		var sources = [
			"index.html",
			"build",
			"build/index.html",
			"build/parent_index.html",
			"build/student_index.html",
			"build/teacher_index.html"
		];
		copyFiles(new DownloadApp(), sources, runGame);		
	}
	/**
	 * 启动游戏
	 */
	function runGame() {
		initConstants(CST);   
		setSkipSession();
		console.timeEnd(CST.TIMER_CHECK_UPDATE_ALL);
		window.location.href = utils.getURLPrefix() + CST.MANIFEST_LOCAL_DIR /*+ 'files/'*/ + 'index.html' + getAction();
	}

	function copyFiles(downloadApp, sources, onsuccess) {
		var source = sources.shift();
		if(!source) {
			return runGame();
		}

		var callee = arguments.callee;
		var distNames = source.split('/');	
		var distName = distNames[0], distPath = "";
		if(distNames.length !== 1) {
			distName = distNames.pop();
			distPath = "/" + distNames.join("/") + "/";
		}

		downloadApp.copyTo(
			utils.getAssetPath() + "zuoye_ensure/" + source,
			utils.getURLPrefix() + CST.MANIFEST_LOCAL_DIR + distPath,
			distName,
			function() {
				callee(downloadApp, sources, onsuccess);
			},
			function(error) {
				if(source === "build") {
					callee(downloadApp, sources, onsuccess);
					return;
				}

				console.error("文件复制失败...", source, error);
				setTimeout(function() {
					//location.reload(); //重新载入！
				})
			}
		);
	}

	function getAction() {
		var action = '?';
		if(utils.isAppToUpdater()) {
			action += 'action=startup';
		}
		return action;
	}

	function skipCheckInSameSession() {
		var scene = JSON.parse(window.localStorage.getItem("switchTo"));
		var skipSession = JSON.parse(window.localStorage.getItem("skipSession"));
		var currentSession = scene && scene.cgc && scene.cgc.session;
		return (currentSession !== null) && (currentSession + CST.DIR_LOCAL === skipSession);
	}

	function setSkipSession() {
		var scene = JSON.parse(window.localStorage.getItem("switchTo"));
		if (scene && scene.cgc) {
			window.localStorage.setItem("skipSession", JSON.stringify(scene.cgc.session + CST.DIR_LOCAL)); //切换年级，刷新session
		}
	}

	/**
	 * 检查资源
	 */
	function checkResources() {
		/*if (!utils.isOnResumeUpdate() && skipCheckInSameSession()) {
			runGame();
			return;
		}*/

		/*if (utils.isPlatformIOS()) {
			$("#check").trigger('click');
		} else if (!utils.isOnResumeUpdate()) {
			window.AppUpdate && window.AppUpdate.checkAppUpdate(function() {
				$("#check").trigger('click');
			}, null, CST.URL_REMOTE_RESOURCE + CST.APK_PATH); // detect app update info
		}*/

		if (utils.isPlatformAndroid() && utils.isOnResumeUpdate()) {
			window.AppUpdate && window.AppUpdate.checkAppUpdate(function() {
				$("#check").trigger('click');
			}, null, CST.URL_REMOTE_RESOURCE + CST.APK_PATH); // detect app update info
		} else {
			$("#check").trigger('click');
		}
	}

	exports.registerHandlers = registerHandlers;
	window.checkResources = checkResources; 
