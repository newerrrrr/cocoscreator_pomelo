// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var State = {
    None              : 1,
    DownloadVersion   : 2, //下载版本号文件 
    DownloadManifest  : 3, //下载MD5列表 
    DownloadAssets    : 4, //下载清单里的文件 
}; 

var UpdateEvents = { 
    SkipUpdate          : 1, //跳过更新 
    AlreadyUpToDate     : 2, //当前是最新版本 
    LocalVersionIsBiger : 3, //本地安装包版本高于服务器版本 
    FoundNewVersion     : 4, //发现新的版本 
    UpdateSuccess       : 5, //更新成功 
    ParseVersionError   : 6, //解析版本错误
    ParseManifestError  : 7, //解析资源列表错误 
    DecompressError     : 8, //解压缩失败
    UpdateError         : 9, //更新失败 
}; 

var retryCount         = 0;        //当前重连次数 
var totalCount         = 0;        //待下载文件总数
var downloadingCount   = 0;        //当前下载数
var download_list      = null;     //待下载的资源列表项 
var local_version      = null;     //本地版本号文件 
var local_manifest     = null;     //本地资源列表 
var remote_manifest    = null;     //服务端资源列表 
var hasDownloadError   = false; 

var storageDir         = ((cc.sys.isNative && jsb) ? jsb.fileUtils.getWritablePath() : '/') + 'ResUpdate/'; 

var name_version       = "version.manifest"; //版本文件
var name_manifest      = "project.manifest"; //md5资源列表
var path_vertion       = storageDir + name_version;
var path_vertion_tmp   = path_vertion + ".tmp";
var path_manifest      = storageDir + name_manifest;
var path_manifest_tmp  = path_manifest + ".tmp";   //用于临时存储下载的资源列表文件
var path_download_list = storageDir + "download.list";

var hotSearchPath = [ //热更搜索路径
    storageDir,
    storageDir + "res/",
    storageDir + "src/",
];

var md5 = require('md5');

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar:cc.ProgressBar, 
        lbTips:cc.Label,
        lbPercent:cc.Label,

        versionManifestUrl: {
            type: cc.Asset,
            default: null
        },
        projectManifestUrl: {
            type: cc.Asset,
            default: null
        }, 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.updatePercent(0);
    },

    onDestroy() {
        this.downloader = null;
        this.progressBar.node.active = false;
        this.lbPercent.node.active = false;
    },

    start () {
        this.init();
        this.downloadVersion(); 
    },

    init:function() { 
        //下载工具
        this.downloader = new jsb.Downloader();
        this.downloader.setOnFileTaskSuccess(this.onFileSuccess.bind(this));
        this.downloader.setOnTaskError(this.onFileError.bind(this));

        retryCount = 0;
        downloadingCount = 0;
        this.zipList = [];//下载到的zip文件

        if (!jsb.fileUtils.isDirectoryExist(storageDir)) {
            jsb.fileUtils.createDirectory(storageDir);
        } 

        //读取apk包里的本地资源列表
        local_version = this.loadJsonFile(this.versionManifestUrl.nativeUrl, true);
        local_manifest = this.loadJsonFile(this.projectManifestUrl.nativeUrl, true);

        //如果缓存目录的版本 > apk版本, 则以缓存的版本为准, 用来与服务器最新版本进行比较 
        let cache_version = this.loadJsonFile(name_version, false);
        let cache_manifest = this.loadJsonFile(name_manifest, false);
        if (cache_version && cache_manifest) {
            let cmpRet = this.compareVersion(cache_version.version, local_version.version);
            if (cmpRet[0] > 0 || cmpRet[1] > 0){
                local_version = cache_version;
                local_manifest = cache_manifest;
            }
            else if (cmpRet[0] < 0 || cmpRet[1] < 0) {
                cc.log("### apk version > cache version !!!, clear cache data...");
                this.clearStorage();
            }
        }
    },

    downloadVersion:function() {
        this.state = State.DownloadVersion; 
        let url = local_version.manifestUrl + name_version;
        let save = storageDir + name_version + '.tmp';
        this.requestOneFile(url, save, "VERSION_ID");
    },

    parseVersion:function(filepath) {
        cc.log("### parseVersion");

        let remote_version = this.loadJsonFile(filepath, false);
        if (!remote_version) {
            this.handleEvents(UpdateEvents.ParseVersionError);
        }
        else {
            cc.log('xxx remote version, local version =', remote_version.version, local_version.version);
            let cmpRet = this.compareVersion(remote_version.version, local_version.version);

            if (cmpRet[0] > 0) {//大版本号较新,需要强更 
                require('NoticeTips').show('游戏有新版本，请前往更新', function(){
                    cc.sys.openURL(remote_version.appDownLoadUrl);
                    this.clearStorage();
                    this.exitGame();
                }.bind(this), 
                this.exitGame);
            } 
            else if (cmpRet[0] === 0 && cmpRet[1] > 0) { //小版本更新
                cc.log('xxx need to update...'); 
                //如果上次有未完成的下载项, 则继续之前的下载, 反之更新资源列表 
                if (jsb.fileUtils.isFileExist(path_manifest_tmp) && jsb.fileUtils.isFileExist(path_download_list)) {
                    let tmpManifest = this.loadJsonFile(path_manifest_tmp, false);
                    if (tmpManifest.version == remote_version.version) {                         
                        remote_manifest = tmpManifest;
                        this.genDownloadList(true);                        
                        if (download_list) {
                            cc.log("xxx resume last download ...");
                            this.downloadAssets();
                            return;
                        } 
                    } 
                    else { 
                        jsb.fileUtils.removeFile(path_manifest_tmp);
                        jsb.fileUtils.removeFile(path_download_list);
                    } 
                } 
                //下载资源列表
                this.downloadManifest();
            }
            else if (cmpRet[0] < 0 || cmpRet[1] < 0) {
                this.handleEvents(UpdateEvents.LocalVersionIsBiger);
            }
            else { 
                this.handleEvents(UpdateEvents.AlreadyUpToDate);
            }
        } 
    },

    downloadManifest:function() {
        this.state = State.DownloadManifest;
        if (jsb.fileUtils.isFileExist(path_manifest_tmp)) { 
            jsb.fileUtils.removeFile(path_manifest_tmp)
        } 
        if (jsb.fileUtils.isFileExist(path_download_list)) { 
            jsb.fileUtils.removeFile(path_download_list)
        } 

        let url = local_version.manifestUrl + name_manifest;
        let save = storageDir + name_manifest + '.tmp';
        this.requestOneFile(url, save, "MANIFEST_ID");       
    },

    parseManifest:function(filepath) {
        remote_manifest = this.loadJsonFile(filepath, false);
        if (!remote_manifest) {
            this.handleEvents(UpdateEvents.ParseManifestError);
        }
        else { 
            this.genDownloadList(false);
            this.downloadAssets();
        }
    },

    //生成下载列表
    genDownloadList:function(isResume) {
        if (isResume) {
            download_list = this.loadJsonFile(path_download_list, false);
        }
        else {
            download_list = [];
            //比较本地和服务器端资源列表差异
            let assets1 = local_manifest.assets 
            let assets2 = remote_manifest.assets 
            for (let key in assets1) {
                if (assets2[key]){ //更新
                    if (assets1[key].md5 != assets2[key].md5) {
                        download_list.push({key:key, val:assets2[key]});
                    }
                }
                else { //删除
                    let filepath = storageDir + key;
                    if (jsb.fileUtils.isFileExist(filepath)) {
                        jsb.fileUtils.removeFile(filepath); 
                    }
                } 
            } 

            //新增
            for (let key in assets2) {
                if (!assets1[key]) {
                    download_list.push({key:key, val:assets2[key]});
                } 
            }
            this.saveToJsonFile(download_list, path_download_list)
        }

        //计算总数
        totalCount = download_list ? download_list.length : 0;
        cc.log('------totalCount:', totalCount)
    },

    //开始下载资源列表中的文件 
    downloadAssets:function() { 
        hasDownloadError = false;
        let length = download_list.length; 

        if (length == 0 && downloadingCount == 0) { 
            this.handleEvents(UpdateEvents.UpdateSuccess); 
        } 
        else { 
            this.state = State.DownloadAssets;
            while(length > 0 && downloadingCount < 1) { 
                let info = download_list[length-1];
                if (!info) break;

                let url = remote_manifest.packageUrl + info.key;
                let saveto = storageDir + info.key + '.tmp';
                this.requestOneFile(url, saveto, info.key);

                length--;
                downloadingCount++;                
            }  
        } 
    },

    //重新下载失败项
    retryDownload:function() { 
        cc.log("### : retryDownload: retryCount = ", retryCount);
        retryCount++; 

        if (retryCount > 3) {
            require('NoticeTips').show('网络连接失败，是否再次尝试连接？',
                this.resumeDownload.bind(this), 
                this.exitGame.bind(this) );
        }
        else {
            this.resumeDownload();
        }
    },

    resumeDownload:function() {
        if (this.state == State.DownloadVersion) {
            this.downloadVersion();
        }
        else if (this.state == State.DownloadManifest) {
            this.downloadManifest();
        }
        else if (this.state == State.DownloadAssets) {
            this.downloadAssets();
        }
    },

    //网络下载工具
    requestOneFile:function(url, storagePath, customId) {
        cc.log('------requestOneFile: ', customId)
        this.downloader.createDownloadFileTask(url, storagePath, customId);
    },

    onFileSuccess:function(task) {
        // cc.log("### : onFileSuccess: customId = ", task.identifier);
        if (this.state == State.DownloadVersion) {
            this.parseVersion(task.storagePath) 
        }
        else if (this.state == State.DownloadManifest) {
            this.parseManifest(task.storagePath);
        }
        else if (this.state == State.DownloadAssets) {
            downloadingCount--;

            if (this.checkFile(task.storagePath, task.identifier))  { 
                //将tmp文件重命名
                let oldName = task.storagePath;
                let newName = oldName.replace('.tmp', '');
                jsb.fileUtils.renameFile(oldName, newName);

                //如果是压缩文件先解压.
                var fileName = task.identifier;
                var extName = /\.[^\.]+$/.exec(fileName); //后缀名
                if (extName == '.zip') { 
                    var fullpath = storageDir + fileName;
                    var result = GameTools.getInstance().decompress(fullpath);
                    if (!result) { 
                        cc.log('@@@@ decompress file fail: ', fileName);
                        hasDownloadError = true; 
                    } 
                    jsb.fileUtils.removeFile(fullpath);
                } 

                if (!hasDownloadError) { 
                    //从下载列表中移除 
                    for (let i = download_list.length-1; i >= 0; i--) { 
                        if (download_list[i].key == fileName) { 
                            download_list.splice(i, 1);
                            break;
                        } 
                    } 
                    //更新UI进度 
                    let percent = 100 * (totalCount - download_list.length)/totalCount;
                    this.updatePercent(percent);  
                } 
            } 
            else {
                hasDownloadError = true; 
            } 

            //本批次下载完后才进行第二批下载
            if (downloadingCount <= 0) { 
                //如果下载失败则尝试重新下载
                if (hasDownloadError) { 
                    this.retryDownload(); 
                    return 
                }
                this.saveToJsonFile(download_list, path_download_list);
                if (download_list.length == 0) {
                    this.handleEvents(UpdateEvents.UpdateSuccess);
                } 
                else {
                    this.downloadAssets(); 
                } 
            }           
        } 
    },

    onFileError:function(task) {
        cc.log("### : onFileError: identifier = ", task.identifier);
        hasDownloadError = true; 
        if (this.state == State.DownloadAssets) {
            downloadingCount--; 
            if (downloadingCount <= 0) {
                this.retryDownload();
            }
        }
        else {
            this.retryDownload();
        } 
    },

    handleEvents:function(event) {
        switch(event) { 
            case UpdateEvents.SkipUpdate:
            case UpdateEvents.AlreadyUpToDate:
                this.enterGame();
                break;

            case UpdateEvents.LocalVersionIsBiger:
                this.clearStorage();
                this.enterGame();
                break;

            case UpdateEvents.UpdateSuccess:
                jsb.fileUtils.removeFile(path_download_list);
                jsb.fileUtils.renameFile(path_vertion_tmp, path_vertion);
                jsb.fileUtils.renameFile(path_manifest_tmp, path_manifest);
                this.enterGame();
                break;

            case UpdateEvents.ParseVersionError:
            case UpdateEvents.ParseManifestError:
                this.retryDownload();
                break;               
            default:
                break;
        }
    },

    loadJsonFile:function(filepath, isInApk) {
        var content

        if (isInApk) { 
            var searchPaths = jsb.fileUtils.getSearchPaths(); 
            var tmpSearchPath = [];//不包含热更路径 

            //去除本热更模块路径和重复路径 
            for (let i = 0, len = searchPaths.length; i < len; i++) { 
                let v = searchPaths[i];
                if (hotSearchPath.indexOf(v) == -1 && tmpSearchPath.indexOf(v) == -1) {
                    tmpSearchPath.push(v);
                }
            }

            jsb.fileUtils.setSearchPaths(tmpSearchPath);
            if (jsb.fileUtils.isFileExist(filepath)) {
                content = jsb.fileUtils.getStringFromFile(filepath);
            }
            jsb.fileUtils.setSearchPaths(searchPaths);
        } 
        else { 
            if (jsb.fileUtils.isFileExist(filepath)) {
                content = jsb.fileUtils.getStringFromFile(filepath);
            }
        } 

        //如果utf8包含3个bom字节,则先去掉bom,否则会导致json解码失败. 这里暂时不处理, 因此需要确保文件编码格式是否正确。
        // if (content && typeof content === 'string' && content.length > 3) {
        //     let str = content.substr(0, 3)
        //     let byte = require('StrTools').stringToByte(str);
        //     if (byte[0] == 0xef && byte[1] == 0xbb && byte[2] == 0xbf) {
        //         let index = content.indexOf('{');
        //         if (index != -1) {
        //             content = content.substr(index);
        //         } 
        //     } 
        // } 

        if (content && typeof content === 'string') {
           content = JSON.parse(content);
        } 
        return content;
    },

    saveToJsonFile:function(objData, savePath) {
        let content = JSON.stringify(objData);
        jsb.fileUtils.writeStringToFile(content, savePath);
    },

    compareVersion:function(strVer1, strVer2) {
        var s = strVer1.split('.');
        var t = strVer2.split('.');

        var bigRet = 0; //大版本比较
        if (parseInt(s[0]) > parseInt(t[0]) || parseInt(s[1]) > parseInt(t[1])) {
            bigRet = 1;
        }
        else if (parseInt(s[0]) < parseInt(t[0]) || parseInt(s[1]) < parseInt(t[1])) {
            bigRet = -1;
        }

        var smallRet = 0; //小版本比较
        if (parseInt(s[2]) > parseInt(t[2]) || parseInt(s[3]) > parseInt(t[3])) {
            smallRet = 1;
        }
        else if (parseInt(s[2]) < parseInt(t[2]) || parseInt(s[3]) < parseInt(t[3])) {
            smallRet = -1;
        }        
        return [bigRet, smallRet];
    },

    clearStorage:function() { 
        cc.log('### : clearStorage');
        jsb.fileUtils.removeFile(path_vertion); 
        jsb.fileUtils.removeFile(path_manifest); 
        jsb.fileUtils.removeFile(path_manifest_tmp); 
        jsb.fileUtils.removeFile(path_download_list); 
        jsb.fileUtils.removeDirectory(storageDir);
    },

    updatePercent:function(percent) { 
        if (percent > 100) percent = 100;
        this.progressBar.progress = percent/100;
        this.lbPercent.string = Math.ceil(percent)+'%';
    }, 

    checkFile:function(filepath, key) { 
        var oldMd5 = null;
        var newMd5 = null;
        for (let i = 0, len = download_list.length; i < len; i++) {
            if (download_list[i].key == key) {
                oldMd5 = download_list[i].val.md5;
                break;
            }
        } 

        var data = jsb.fileUtils.getDataFromFile(filepath);
        if (data) {
            newMd5 = md5.create().update(data).hex();
        }
        // cc.log("--------oldMd5, newMd5:", oldMd5, newMd5)
        return oldMd5 === newMd5;
    },

    enterGame:function() { 
        if (totalCount > 0 ) { 
            cc.log('### xxxxxxxxxxxxxxxxxxx restart ...'); 
            this.restartGame();
        } 
        else {
            cc.log('### ---------------- enterGame'); 
            cc.director.loadScene('LoadingScene');
        }
    },

    exitGame:function() {
        cc.game.end();
    },

    restartGame:function() {
        this.onDestroy(); 

        this.lbTips.string = '资源重新加载中...';

        //去除重复路径后保存,然后在 main.js中读取
        var searchPaths = jsb.fileUtils.getSearchPaths(); 
        var tmpSearchPath = [].concat(hotSearchPath); 
        for (let i = 0, len = searchPaths.length; i < len; i++) { 
            let v = searchPaths[i];
            if (tmpSearchPath.indexOf(v) == -1) {
                tmpSearchPath.push(v);
            } 
        } 
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(tmpSearchPath));
        cc.sys.localStorage.setItem('RestartAfterHotUpdate', 'true');
        jsb.fileUtils.setSearchPaths(tmpSearchPath);
        cc.log('searchPaths: ', tmpSearchPath);
        
        //重启 
        cc.audioEngine.stopAll();
        setTimeout(function() { 
            cc.game.restart(); 
        }, 0);
    },


    // update (dt) {
    // },
});
