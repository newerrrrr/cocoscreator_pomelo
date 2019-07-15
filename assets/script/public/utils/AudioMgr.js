
var AudioMgr = {};

var bgmVolume = 1.0; 
var effVolume = 1.0; 
var bgmAudioId = null;

AudioMgr.init = function() {
    bgmVolume = gt.getLocal('bgmVolume', 1.0);
    effVolume = gt.getLocal('effVolume', 1.0);
}

/* 播放背景音乐 
** filename:相对于 resources/sound/ 目录的路径, 文件名不包含扩展名
*/
AudioMgr.playMusic = function(filename, isLoop) { 
    this.stopMusic();

    let filepath = 'sound/' + filename;
    cc.loader.loadRes(filepath, cc.AudioClip, function(err, clip) {
        if (err) {
            cc.log('xxx invalid audio file:', filename);
            return 
        }
        bgmAudioId = cc.audioEngine.playMusic(clip, isLoop, bgmVolume);
    }.bind(this) );
} 

AudioMgr.stopMusic = function() { 
    if (bgmAudioId != null) {
        cc.audioEngine.stopMusic(bgmAudioId);
        bgmAudioId = null;
    }
}

AudioMgr.pauseMusic = function() {
    if (bgmAudioId != null) {
        cc.audioEngine.pauseMusic();
    }    
}

AudioMgr.resumeMusic = function() {
    if (bgmAudioId != null) {
        cc.audioEngine.resumeMusic();
    }      
}

AudioMgr.setMusicVolume = function(volume) { 
    if (bgmAudioId == null) return;

    cc.audioEngine.setMusicVolume(volume);

    if (bgmVolume != volume) {
        gt.setLocal('bgmVolume', volume);
    }
}

AudioMgr.getMusicVolume = function() {
    return bgmVolume;
}



AudioMgr.playEffect = function(filename, isLoop) {
    let filepath = 'sound/' + filename;
    cc.loader.loadRes(filepath, cc.AudioClip, function(err, clip) {
        if (err) {
            cc.log('### invalid audio file:', filename);
            return 
        }
        if (effVolume > 0) {
            cc.audioEngine.playEffect(clip, isLoop, effVolume);
        }
    }.bind(this) );
}

AudioMgr.pauseAllEffects = function() {
    cc.audioEngine.pauseAllEffects();
}

AudioMgr.resumeAllEffects = function() {
    cc.audioEngine.resumeAllEffects();
}

AudioMgr.stopAllEffects = function() {
    cc.audioEngine.stopAllEffects() 
}

AudioMgr.setEffectVolume = function(volume) {
    if (effVolume != volume) {
        effVolume = volume;
        gt.setLocal('effVolume', volume);
    } 
}

AudioMgr.getEffectVolume = function() {
    return effVolume;
}

AudioMgr.pauseAll = function() {
    this.pauseMusic();
    this.pauseAllEffects();
}

AudioMgr.resumeAll = function() {
    this.resumeMusic();
    this.resumeAllEffects();
}

AudioMgr.init();

module.exports = AudioMgr; 
