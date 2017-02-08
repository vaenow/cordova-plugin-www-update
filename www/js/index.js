/**!
 * index.js
 * @author LuoWen
 * @date 20150606
 */
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    console.log("onDeviceReady..");
    //debugger
    // ensureToUpdater2StartUp(); // toupdater -> startup
    // ensureStartUp2Exam(); // startup -> exam
    // setOnResumeUpdate(utils);
    // // navigator.splashscreen.hide();
    // //logger('准备检查版本...');
    // constants.initConstants(CST);
    // update.registerHandlers();
    // utils.setAssetPath();

    // backBtn.init();

    // handleStatis();
    // if (utils.isAppToUpdater()) {
    //     // isUpdaterDirExist(function(err, isExist){
    //     //     !!isExist.isExist //自动更新文件夹 是否存在
    //     //         ? location.href = CST.MANIFEST_UPDATER_DIR_FULL + "index.html?action=startup"
    //     //         : checkResources(); // 如果不存在自动更新，则更新！
    //     // });
    //     checkResources(); // 如果不存在自动更新，则更新！
    // } else if (utils.isAppStartUp()) {
    //     isExamDirExist(function(err, isExist) {
    //         !!isExist.isExist ? $("#run").trigger('click') : checkResources();
    //     });
    // } else {
    //     //检查最新版本
    //     checkResources();
    // }

    // window.isLoadedOnce = true;
}

