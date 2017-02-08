/**
 * Const
 */

	var utils = require("./Utils"),
		config = require('./Config');
        
	var CONST = {};

	CONST.BG_IMG_STARTUP = "img/logo.gif"; //程序启动时的背景图标
	CONST.BG_IMG_GAME = "img/logo.gif"; //作业去游戏的背景图标

	CONST.CHECK_COMPLETION_EVENT = 'checkCompletionEvt';

	CONST.TIMER_CHECK_UPDATE_ALL = 'TIMER_CHECK_UPDATE_ALL';
	CONST.TIMER_VERSION_COMPARE_L2S = 'TIMER_VERSION_COMPARE_L2S'; // local compare server
	CONST.TIMER_VERSION_COMPARE_L2L = 'TIMER_VERSION_COMPARE_L2L'; // local compare local
	CONST.TIMER_CHECK_COMPLETION = "TIMER_CHECK_COMPLETION";
	CONST.TIMER_CHECK_COMPLETION_V2 = "TIMER_CHECK_COMPLETION_V2";

	CONST.NETWORK_ERROR_TRANSFERING = "网络传输中..."; //6s 后
	CONST.NETWORK_ERROR = "网络传输失败"; //30s 后
	CONST.NETWORK_ERROR_RETRY_MSG = "网络传输失败";
	CONST.NETWORK_ERROR_RETRY_BTN = "重试";

	CONST.ONRESUME_DIRECT_UPDATE = "onresume_direct_update";

	CONST.NOTIFICATION_ASK_TO_RETRIEVE = "下载即将停止，请打开应用，继续下载";
	CONST.NOTIFICATION_REMIND_INTO_BG = "应用进入后台";

	CONST.ZIP_SOURCE_FILE = "zipSourceFile.zip";

	// ===== EClass ====
	CONST.PROGRESS_TYPE = {
		DOWNLOADING     : "."//"更新：下载资源文件..."
		, DELETING      : "清除冗余资源..."//"更新：删除冗余文件..."
		, CHECKING      : ". . ."//"更新：检查资源完整性..." //deprecated
		, CHECKING_AGAIN: ". . . ."//"更新：检查资源完整性..." //deprecated
		, UNZIPPING     : ". . . . ."//"更新：解压资源文件..."
	};
	
	CONST.RESOUCES_UPDATE_TITLE = "学习内容";
	CONST.RESOUCES_NEED_UPDATE = "学习内容有更新啦！";
	CONST.RESOUCES_NEED_UPDATE_ONRESUME = "学习内容有更新啦！";
	CONST.RESOUCES_UPDATE_OK_BTN = "更新";

	CONST.DOWNLOAD_FAIL_TITLE = "下载出错";
	CONST.DOWNLOAD_FAIL_TEXT = "当前网络不可用，请检查你的网络设置后重试。";
	CONST.DOWNLOAD_FAIL_BTN_YES = "重试";
	// ===== EClass End ====

	// ===== Game ====
	var CONST_GAME = CONST.CONST_GAME = {};
	CONST_GAME.PROGRESS_TYPE = {
		DOWNLOADING     : "更新游戏集，含多个单元"//"更新：下载资源文件..."
		, DELETING      : "清除冗余资源..."//"更新：删除冗余文件..."
		, CHECKING      : ". . ."//"更新：检查资源完整性..." //deprecated
		, CHECKING_AGAIN: ". . . ."//"更新：检查资源完整性..." //deprecated
		, UNZIPPING     : "正在解压..."//"更新：解压资源文件..."
	};

	CONST_GAME.RESOUCES_UPDATE_TITLE = "游戏内容"; 
	CONST_GAME.RESOUCES_NEED_UPDATE = "需要下载或更新游戏内容";
	CONST_GAME.RESOUCES_NEED_UPDATE_ONRESUME = "需要下载或更新游戏内容";
	CONST_GAME.RESOUCES_UPDATE_OK_BTN = "开始";

	CONST_GAME.DOWNLOAD_FAIL_TITLE = "下载出错";
	CONST_GAME.DOWNLOAD_FAIL_TEXT = "当前网络不可用，请检查你的网络设置后重试。";
	CONST_GAME.DOWNLOAD_FAIL_BTN_YES = "重试";
	// ===== Game End ====
	
	// ===== JustInstall ====
	var CONST_INSTALL = CONST.CONST_INSTALL = {};
	CONST_INSTALL.PROGRESS_TYPE = {
		DOWNLOADING     : "初始化，请耐心等待..."
		, DELETING      : "清除冗余资源..."
		, CHECKING      : ". . ." //deprecated
		, CHECKING_AGAIN: ". . . ." //deprecated
		, UNZIPPING     : "初始化，请耐心等待..."
	};

	CONST_INSTALL.RESOUCES_UPDATE_TITLE = "初始化";
	CONST_INSTALL.RESOUCES_UPDATE_OK_BTN = "好的";

	CONST_INSTALL.DOWNLOAD_FAIL_TITLE = "初始化出错";
	CONST_INSTALL.DOWNLOAD_FAIL_TEXT = "当前网络不可用，请检查你的网络设置后重试。";
	CONST_INSTALL.DOWNLOAD_FAIL_BTN_YES = "重试";
	// ===== JustInstall End ====

	// ===== To Updater Start ====	
	var CONST_TO_UPDATER = CONST.CONST_TO_UPDATER = {};
	CONST_TO_UPDATER.PROGRESS_TYPE = {
		DOWNLOADING     : "正在优化框架..."
		, DELETING      : "清除冗余资源..."
		, CHECKING      : ". . ." //deprecated
		, CHECKING_AGAIN: ". . . ." //deprecated
		, UNZIPPING     : "正在优化框架..."
	};

	CONST_TO_UPDATER.RESOUCES_UPDATE_TITLE = "优化框架";
	CONST_TO_UPDATER.RESOUCES_NEED_UPDATE = "需要优化框架";
	CONST_TO_UPDATER.RESOUCES_NEED_UPDATE_ONRESUME = "需要优化框架";
	CONST_TO_UPDATER.RESOUCES_UPDATE_OK_BTN = "好的";

	CONST_TO_UPDATER.DOWNLOAD_FAIL_TITLE = "优化框架出错";
	CONST_TO_UPDATER.DOWNLOAD_FAIL_TEXT = "当前网络不可用，请检查你的网络设置后重试。";
	CONST_TO_UPDATER.DOWNLOAD_FAIL_BTN_YES = "重试";
	// ===== To Updater End ====
	
	/*function initConstants(CST) {
		CST.URL_REMOTE = ($("#remoteIP").val() || config.URL_REMOTE_DEFAULT) + '/';
		CST.DIR_REMOTE_PRE = 'update';
		CST.DIR_REMOTE = CST.DIR_REMOTE_PRE + utils.getDirSuffix(CST);
		CST.DIR_LOCAL = 'mathgames' + utils.getDirSuffix(CST);
		CST.MANIFEST_FILE_NAME = 'manifest.json';
		//CST.MANIFEST_LOCAL_DIR = cordova.file.externalRootDirectory;
		CST.MANIFEST_LOCAL_DIR = CST.DIR_LOCAL;
		//        CST.MANIFEST_LOCAL_DIR = cordova.file.externalRootDirectory + CST.DIR_LOCAL;
		CST.MANIFEST_LOCAL = utils.getURLPrefix() + CST.MANIFEST_LOCAL_DIR + CST.MANIFEST_FILE_NAME;
		CST.MANIFEST_REMOTE = CST.URL_REMOTE + CST.DIR_REMOTE + CST.MANIFEST_FILE_NAME;
		CST.APK_PATH = CST.DIR_REMOTE_PRE + "_apk/version.xml";
		CST.DEFAULT_DIR_LOCAL = "0";
	}*/

	function initConstants(CST) {
		CST.DEFAULT_DIR_LOCAL = "0";
		CST.URL_REMOTE = ($("#remoteIP").val() || config.URL_REMOTE_DEFAULT) + '/';
		CST.DIR_REMOTE_PRE = 'update';
		CST.DIR_REMOTE = "";
		CST.ZIP_ROUTER = "update/getUpdate";
		CST.UPDATE_STATIS_ROUTER = "update/downloadlog/save";
		CST.DIR_LOCAL = 'mathgames' + utils.getDirSuffix(CST);
		CST.MANIFEST_FILE_NAME = 'manifest.json';
		CST.MANIFEST_FILE_NAME_DEL = 'manifestDel.json'; //需要被删除的文件清单
		CST.MANIFEST_LOCAL_DIR = CST.DIR_LOCAL;
		CST.MANIFEST_LOCAL = utils.getURLPrefix() + CST.MANIFEST_LOCAL_DIR + CST.MANIFEST_FILE_NAME;
		CST.MANIFEST_LOCAL_DEL = utils.getURLPrefix() + CST.MANIFEST_LOCAL_DIR + CST.MANIFEST_FILE_NAME_DEL;
		//CST.MANIFEST_REMOTE = CST.URL_REMOTE + CST.MANIFEST_FILE_NAME + utils.getUrlRemoteParams();
		CST.ZIP_LIST_REMOTE = CST.URL_REMOTE + CST.ZIP_ROUTER;
		CST.APK_PATH = CST.DIR_REMOTE_PRE + "_apk/" + utils.getVersionFileName();

		CST.URL_REMOTE_RESOURCE = config.URL_REMOTE_RESOURCE + "/";
		CST.URL_UPDATE_STATIS = CST.URL_REMOTE + CST.UPDATE_STATIS_ROUTER; //数据统计的接口

		CST.MANIFEST_UPDATER_DIR = "mathgames" + "99/"; //自动更新的 动态更新文件夹
		CST.MANIFEST_UPDATER_DIR_FULL = utils.getURLPrefix() + CST.MANIFEST_UPDATER_DIR; //自动更新的 动态更新文件夹

		if(utils.isAppToUpdater()) handleToUpdaterConst(CST);
		else if(utils.isAppJustInstall()) handleInstallConst(CST);
		else handleGameConst(CST);
	}

	/**
	 * 如果是游戏内容更新，需要换另一种说法
	 */
    function handleGameConst(CST){
        if(utils.isToGame(CST)) {
            for(var k in CST.CONST_GAME) {
                CST[k] = CST.CONST_GAME[k];
            }
        }
    }

    /**
     * 首次安装的文字提示
     */
	function handleInstallConst(CST) {
		for (var k in CST.CONST_INSTALL) {
			CST[k] = CST.CONST_INSTALL[k];
		}
	}

	/**
	 * 如果是自动更新的更新，需要换另一种说法
	 */
    function handleToUpdaterConst(CST){
        for(var k in CST.CONST_TO_UPDATER) {
            CST[k] = CST.CONST_TO_UPDATER[k];
        }
    }

	module.exports.CST = CONST;
	module.exports.initConstants = initConstants;
	module.exports.handleInstallConst = handleInstallConst;
