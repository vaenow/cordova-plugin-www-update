    /*
     * DownloadApp.js
     */
    var CST = require('./Const').CST,
        utils = require('./Utils'),
        config = require('./Config');

    var DownloadApp = function() {
    };

    DownloadApp.prototype = {
        load: function(uri, folderName, fileName, progress, success, fail) {
            var that = this,
                filePath = "";
            that.progress = progress;
            that.success = success;
            that.fail = fail;


            that.getFilesystem(
                function(fileSystem) {
                    //console.log("GotFS");
                    that.getFolder(fileSystem, folderName, function(folder) {
                        filePath = folder.toURL() + "/" + fileName;
                        that.transferFile(uri+'?dt='+new Date().getTime(), filePath, progress, success, fail);
                    }, function(error) {
                        console.log("Failed to get folder: " + error.code);
                        typeof that.fail === 'function' && that.fail(error);
                    });
                },
                function(error) {
                    console.log("Failed to get filesystem: " + error.code);
                    typeof that.fail === 'function' && that.fail(error);
                }
            );
        },

        /**
         *  LocalFileSystem - Android updated 20150721
         *
         * 0 temporary file:///storage/emulated/0/Android/data/com.allere.auto2/cache/
         * 1 persistent file:///storage/emulated/0/
         * 2 content content://
         * 3 assets file:///android_asset/
         * 4 files file:///data/data/com.allere.auto2/files/
         * 5 files-external file:///storage/emulated/0/Android/data/com.allere.auto2/files/
         * 6 documents file:///data/data/com.allere.auto2/files/Documents/
         * 7 sdcard file:///storage/emulated/0/
         * 8 cache file:///data/data/com.allere.auto2/cache/
         * 9 cache-external file:///storage/emulated/0/Android/data/com.allere.auto2/cache/
         * 10 root file:///
         *
         *  cordova.file - Android
         *
         * applicationDirectory: "file:///android_asset/"
         * applicationStorageDirectory: "file:///data/data/com.allere.auto2/"
         * cacheDirectory: "file:///data/data/com.allere.auto2/cache/"
         * dataDirectory: "file:///data/data/com.allere.auto2/files/"
         * documentsDirectory: null
         * externalApplicationStorageDirectory: "file:///storage/emulated/0/Android/data/com.allere.auto2/"
         * externalCacheDirectory: "file:///storage/emulated/0/Android/data/com.allere.auto2/cache/"
         * externalDataDirectory: "file:///storage/emulated/0/Android/data/com.allere.auto2/files/"
         * externalRootDirectory: "file:///storage/emulated/0/"
         * sharedDirectory: null
         * syncedDataDirectory: null
         *

         * 
         *  LocalFileSystem - IOS
         * 
         * 9 "file:///"
         * 8 "bundle" "file:///private/var/mobile/Containers/Bundle/Application/210248BF-B8C1-4189-9BCC-335267AE4D80/AutoUpdateIOS.app/"
         * 7 "cache" "file:///var/mobile/Containers/Data/Application/D199217E-CB90-48BA-B878-E44820C122D9/Library/Caches/"
         * 6 "documents-nosync" "file:///var/mobile/Containers/Data/Application/D199217E-CB90-48BA-B878-E44820C122D9/Documents/NoCloud/"
         * 5 "documents" "file:///var/mobile/Containers/Data/Application/D199217E-CB90-48BA-B878-E44820C122D9/Documents/"
         * 4 "library-nosync" "file:///var/mobile/Containers/Data/Application/D199217E-CB90-48BA-B878-E44820C122D9/Library/NoCloud/"
         * 3 "library" "file:///var/mobile/Containers/Data/Application/D199217E-CB90-48BA-B878-E44820C122D9/Library/"
         * 2 "assets-library" "assets-library://"
         * 1 "persistent" "file:///var/mobile/Containers/Data/Application/D199217E-CB90-48BA-B878-E44820C122D9/Documents/"
         * 0 "temporary" "file:///var/mobile/Containers/Data/Application/D199217E-CB90-48BA-B878-E44820C122D9/tmp/"
         *
         * <p>
         *  function listFileSys(i, end) {
         *     window.requestFileSystem(i, 0, function success(d) {
         *           console.log(i++, d.name, d.root.nativeURL);
         *           if(i<end) listFileSys(i, end);
         *      }, function fail(e){  console.log('ee',e);});
         *  }
         *
         *  listFileSys(0, 30)
         * </p>
         * @param success
         * @param fail
         */
        getFilesystem:function (success, fail) {
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(utils.getFSDependOnPlatform()/*LocalFileSystem.FILES*/, 0, success, fail);
        },

        resolveLocalFileSystemURL: function(url, onsuccess, onfail) {
            window.resolveLocalFileSystemURL(
                url, 
                onsuccess,
                function(error) {
                    console.log("resolveLocalFileSystemURL error", error);
                    onfail && onfail.call(this, error);
                });
        },
                
        //递归创建文件夹 -recursive
        getFolder: function (fileSystem, folderName, success, fail, parentPath) {
            //var folders = folderName.split('/');            
            var idx = folderName.indexOf(CST.DIR_LOCAL);
            idx = idx === -1 ? 0 : idx;
            var folders = folderName.slice(idx).split('/');

            parentPath = !!parentPath ? parentPath += '/' : '';
            if(folders.length > 1){
                parentPath += folders.shift();
                fileSystem.root.getDirectory(parentPath, {create: true, exclusive: false}, function(a,b,c){/*console.log('create a directory', a.fullPath);*/}, fail);
                arguments.callee.call(this, fileSystem, folders.join('/'), success, fail, parentPath);
            } else if(folders.length === 1) {
                fileSystem.root.getDirectory(parentPath + folders.shift(), {create: true, exclusive: false}, success, fail);
            } else {
                console.error('folder length error');
            }
        },

        transferFile: function (uri, filePath, progress, success, fail) {
            var that = this;
            that.progress = progress;
            that.success = success;
            that.fail = fail;

            var transfer;
            if(utils.isUsingPRD()) {
                console.log("using PRD");
                //Pause and Resume Download
                var option = {blockSize:config.PRD_BLOCK_SIZE};
                utils.isPlatformIOS() && (option.disk = utils.getURLPrefix() + CST.MANIFEST_LOCAL_DIR);
                transfer = new PRD(option); 
            } else {
                console.log("using native FT");
                transfer = new FileTransfer();
            }
            transfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    typeof that.progress === 'function' && that.progress(perc); // progression on scale 0..100 (percentage) as number
                } else {
                }
            };

            transfer.download(
                uri,
                filePath,
                function(entry) {
                    console.log("File saved to: " + entry.toURL());
                    typeof that.success === 'function' && that.success(entry);
                },
                function(error) {
                    console.log("An error has occurred: Code = " + error.code);
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("download error code " + error.code);
                    typeof that.fail === 'function' && that.fail(error);
                }
            );
        },

        //zip.unzip(<source zip>, <destination dir>, <callback>, [<progressCallback>]);
        unzip: function(fileName, folderName, success, fail, progress) {
            var that = this;
            that.success = success;
            that.fail = fail;
            that.progress = progress;

            that.getFilesystem(
                function(fileSystem) {
                    that.getFolder(fileSystem, folderName, function(folder) {
                        var folderPath = folder.toURL();
                        zip.unzip(
                            getFilePath(folderPath, fileName),
                            folderPath,
                            function(code) {
                                console.log("result: " + code);
                                code === 0
                                    ? typeof that.success === 'function' && that.success()
                                    : typeof that.fail === 'function' && that.fail(code);
                            }, function(data) {
                                typeof that.progress === 'function' && that.progress(data);
                            });
                    }, function(error) {
                        console.log("Failed to get folder: " + error.code);
                        typeof that.fail === 'function' && that.fail(error);
                    });
                },
                function(error) {
                    console.log("Failed to get filesystem: " + error.code);
                    typeof that.fail === 'function' && that.fail(error);
                }
            );

            function getFilePath(folderPath, fileName) {
                return utils.isPathContainProtocol(fileName) ? fileName : folderPath + fileName;
            }
        },

        del: function (folderName, fileName, success, fail, args) {
            var that = this,
                args = args || [];

            // 注意：IOS中，删除文件不能带有前面的 
            // "file:///var/mobile/Containers/Data/Application/CA833E6A-2747-43B0-9614-260168BBDEC5/Library/NoCloud/"
            utils.isPlatformIOS() && (folderName = folderName.replace(utils.getURLPrefix(), ""));

            that.getFilesystem(
                function (fileSystem) {
                    console.log("folderName + fileName", folderName + fileName)
                    fileSystem.root.getFile(folderName + fileName, {create: false},
                        function (entry) {
                            entry.remove(function () {
                                console.log("File removed: " + entry.name);
                                //that.delEmptyDir(folderName);
                                entry = null;
                                typeof success === 'function' && success(args);
                            }, function () {
                                console.log("error deleting the file " + error.code);
                                typeof fail === 'function' && fail(args);
                            });
                        }, function (error) {
                            console.log("file does not exist", error);
                            typeof fail === 'function' && fail(args);
                        });
                }, function (error) {
                    console.log("Failed to get folder: " + error.code);
                    typeof that.fail === 'function' && that.fail(error);
                });
        },

        delDir: function (folderName, recursive, success, fail) {
            var that = this;

            that.getFilesystem(
                function (fileSystem) {
                    fileSystem.root.getDirectory(folderName, {create: false},
                        function (entry) {
                            var suc = function () {
                                console.log("Directory removed: " + entry.name);
                                typeof success === 'function' && success(entry);
                            };
                            var fal = function (error) {
                                console.log("error deleting the directory " + error.code);
                                typeof fail === 'function' && fail(error);
                            };
                            if(recursive){
                                entry.removeRecursively(suc, fal);
                            } else {
                                entry.remove(suc, fal);
                            }
                        }, function (error) {
                            console.log("Directory: %s does not exist", folderName);
                            if(error.code === FileError.NOT_FOUND_ERR) {
                                typeof success === 'function' && success();
                            } else {
                                typeof fail === 'function' && fail(error);
                            }
                        });
                }, function (error) {
                    console.log("Failed to get folder: " + error.code);
                    typeof fail === 'function' && fail(error);
                });
        },

        isFileExist: function(fileURL, success, fail) {
            var that = this;

            that.getFilesystem(
                function(fs){
                    fs.root.getFile(fileURL, {create:false}, function(fe){
                        typeof success === 'function' && success(fe);
                    }, function(error){
                        console.log("File %s not exist.", fileURL);
                        typeof fail === 'function' && fail(error);
                    });
                }, function(error) {
                    console.log(error);
                }
            )
        },

        isDirExist: function(fileURL, success, fail) {
            var that = this;

            that.getFilesystem(
                function(fs){
                    fs.root.getDirectory(fileURL, {create:false}, function(fe){
                        typeof success === 'function' && success(fe);
                    }, function(error){
                        console.log("Dir %s not exist.", fileURL);
                        typeof fail === 'function' && fail(error);
                    });
                }, function(error) {
                    console.log(error);
                }
            )
        },

        /**
         * 取得文件夹下面所有文件
         * @param directory
         * @param callback
         * @param scope
         * @param data
         */
        fetchAllFiles: function(directory, callback, scope, data) {
            var that = this;
            var entries = [];         //window.entries = [];
            var entriesFull = [];         //window.entriesFull = [];
            var entriesNativeURL = [];        //window.entriesNativeURL = [];

            window.setTimeout(function(){ //TODO 1s后处理文件数组
                callback && callback.call(scope, entriesFull, data);
            }, 2000);

            that.getFilesystem(getFSSuccess, getFSFail);

            function getFSSuccess(fs) {
                fs.root.getDirectory(directory, {}, getDirSuccess, getDirFail);
            }

            function getDirSuccess(dirEntry) {
                startReadEntries(dirEntry); // Start reading dirs.
            }

            function startReadEntries (de) { //深度优先 // de: dirEntry
                de.isDirectory && de.createReader().readEntries(function (des) { //des: dirEntries
                    if (!des.length) return;

                    des.sort(function (a, b) {
                        a = a.name;
                        b = b.name;
                        return a < b ? -1 : a > b ? 1 : 0;
                    })
                        .forEach(function (de) {
                            if (!de.isDirectory) {
                                //console.log(de.toURL());
                                entries.push(de.toURL());
                                entriesFull.push(de.fullPath);
                                entriesNativeURL.push(de.nativeURL);
                            }
                            startReadEntries(de);
                        });
                }, function (e) {
                    console.log("errorHandler", e);
                });
            }

            function getFSFail(error) {
                console.log(error);
            }

            function getDirFail(e){
                console.log("errorHandler", e);
            }
        },

        /**
        * 复制文件
        */
        copyTo: function(sourceFileURL, distDirPath, distFileName, onsuccess, onfail) {
            var me = this;
            // console.log("start to resolve", sourceFileURL, distDirPath, distFileName);
            if(utils.isPlatformIOS()) {
                me.del(distDirPath, distFileName, _copyTo, _copyTo);
            } else {
                _copyTo();
            }

            function _copyTo(argument) {
                // console.log("start _copyTo");
                me.resolveLocalFileSystemURL(sourceFileURL, function(sourceEntry){
                    // console.log("copyTo resolve", sourceEntry)
                    me.resolveLocalFileSystemURL(distDirPath, function(distEntry){
                        // console.log("copyTo resolve", distEntry)
                        sourceEntry.copyTo(distEntry, distFileName, onsuccess, onfail);
                    }, onfail)
                }, onfail);

            }
        },

        listDir: function(dirPath, recursive, success, fail, entryHandler, verbose) {
            var me = this;
            me.dirDepth = 0;
            me.retData = {
                //name: 0, // 11,12,21...34
                //dirName: null,
                totalSize: 0,
                totalSizeMb: 0,
                totalFileNum: 0,
                totalDirNum: 0,
                maxDirDepth: 0
            };
            _listDir.apply(me, Array.prototype.slice.call(arguments));
        },

        getDirSize: function(dirPath, success, fail, verbose) {

            function _entryHandler(entry, file) {
                var me = this;
                if (entry.isFile && file) {
                    me.retData.totalSize += file.size;
                }
            }

            function _success(data) {
                var me = this;
                me.retData.totalSizeMb = (me.retData.totalSize / 1024 / 1024).toFixed(2);
                verbose && console.log(data);
                typeof success === 'function' && success.call(me, me.retData);
            }

            function _fail(error) {
                var me = this;
                console.error("getDirSize Failed", error);
                typeof fail === 'function' && fail.call(me, error);
            }

            this.listDir.call(this, dirPath, true, _success, _fail, _entryHandler, verbose)
        }

    };

    function _listDir(dirPath, recursive, success, fail, entryHandler, verbose) {
        var me = this;
        var args = arguments;
        ++me.dirDepth;
        me.retData.maxDirDepth = me.dirDepth > me.retData.maxDirDepth ? me.dirDepth : me.retData.maxDirDepth;
        me.getFilesystem(function(fs) {
            fs.root.getDirectory(dirPath || '/', {
                create: false
            }, function(dirEntry) {

                verbose && console.log(dirEntry);
                
                // Get a list of all the entries in the directory
                dirEntry.createReader().readEntries(getEntryDetails, _fail);

            }, _fail);

        }, _fail);

        function getEntryDetails(entries, file) {
            if (!entries.length) {
                --me.dirDepth;
                verbose && console.info("dirDepth:", me.dirDepth);
                if (me.dirDepth === 0) {
                    verbose && console.warn("success", me.retData);
                    typeof success === 'function' && success.call(me, me.retData);
                } else if (me.dirDepth < 0) {
                    console.error("fail");
                    typeof fail === 'function' && fail.call(me);
                }
                return;
            }

            var entry = entries.pop();
            verbose && console.log('En - ', entry);

            if (entry.isFile) {
                entry.file(function(file) {
                    me.retData.totalFileNum++;

                    typeof entryHandler === "function" && entryHandler.call(me, entry, file);
                    getEntryDetails(entries, file); //continue;
                });
            }

            if (entry.isDirectory) {
                ++me.retData.totalDirNum;
                recursive && _listDir.apply(me, [entry.fullPath].concat(Array.prototype.slice.call(args, 1)));

                typeof entryHandler === "function" && entryHandler.call(me, entry, file);
                getEntryDetails(entries); //continue;
            }
        }

        function _fail(error) {
            console.log("Failed to list directory contents: ", error);
            typeof fail === 'function' && fail.call(me, error);
        }

    }

    module.exports = DownloadApp;
