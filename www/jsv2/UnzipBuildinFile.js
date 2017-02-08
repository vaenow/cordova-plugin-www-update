/**
 * UnzipBuildinFile.js
 * @author LuoWen
 * @date 20160303
 */

function UnzipBuildinFile(){}
var p = UnzipBuildinFile.prototype;

/**
 * 无法直接从 www 文件夹解压到外部，只能先拷贝出去，再解压，最后删除之
 * @return {[type]} [description]
 */
p.cpZipFileOutWww = function() {
    var download = require(utils.getOnResumePluginModule("DownloadFile"));

    download(utils.getAssetPath() + CST.ZIP_SOURCE_FILE, CST.MANIFEST_LOCAL_DIR);
};


module.exports = new UnzipBuildinFile();