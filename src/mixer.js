


/* Chooses the available Audio API */
window.AudioContext = window.AudioContext||window.webkitAudioContext;



/* Our Audio Wrapper called 'AdLib' */
var adlib = new function(){

    /* What directory are the audio files stored? Defaults to root */
    this.soundUrl = "";

    /* Variable for the Web Audio API Context */
    this.AudioContext = undefined;


    /* Cache of audio buffers stored as a hashtable: buffer = audio['name'] */
    this.audio = {};

    /* Must be initalised before use */
    this.init = function(config){

        /* Parses configuration tags */
        if(config != undefined){
            /* Sets audio file directory */
            if(config['urlPrefix'] != undefined){
                adlib.soundUrl = config['urlPrefix'];
            } 
        }
        /* Request a new AudioContext */
        this.AudioContext = new AudioContext(); 
    }

    /* Helper functions */
    this.getTagFromURL = function(url,tag){
        if(tag != undefined) return tag;
        return adlib.getSingleURL(url);
    }
    this.getSingleURL = function(urls){
        if(typeof(urls) == "string") return urls;
        return urls[0];
    }
    this.getURLArray = function(urls){
        if(typeof(urls) == "string") return [urls];
        return urls;
    }

    /* Load audio file  */
    this.load = function(urls,tag,cb){
        var url = adlib.getSingleURL(urls);
        var tag = adlib.getTagFromURL (urls,tag);
        var request = new XMLHttpRequest();
        request.open('GET', adlib.soundUrl + url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            adlib.AudioContext.decodeAudioData(request.response, function(buffer) {
                adlib.audio[tag] = buffer;
                if(cb!=undefined) cb();
            }, adlib.errorLoadWebkitAudtioFile);
        };
        request.send();
    }
    this.errorLoadWebkitAudtioFile = function(e){
        console.log('error');
    }

    /* Play one-off audio  */
    this.play = function(tag, volume) {
        if(volume==undefined) volume = 1.0;
        var context = adlib.AudioContext;
        var gainNode = context.createGain();
        gainNode.gain.value=volume;
        var buffer = adlib.audio[tag];
        var source = context.createBufferSource();
        source.buffer = buffer;   
        source.connect(gainNode);       
        gainNode.connect(context.destination);
        source.start(0);                          
    }
}




   
 






$( document ).on( "keydown",
    function(e) {
        if(e.which == 81) {
          adlib.play('cowbell');
          $("button.keyboardQ").toggleClass('active');
        }
        if(e.which == 87) {
          adlib.play('crash');
          $("button.keyboardW").toggleClass('active');
        }
        if(e.which == 69) {
          adlib.play('hihat');
          $("button.keyboardE").toggleClass('active');
        }
        if(e.which == 82) {
          adlib.play('hihatopen');
          $("button.keyboardR").toggleClass('active');
        }

        if(e.which == 65) {
          adlib.play('kick');
          $("button.keyboardA").toggleClass('active');
        }
        if(e.which == 83) {
          adlib.play('snare1');
          $("button.keyboardS").toggleClass('active');
        }
        if(e.which == 68) {
          adlib.play('snare2');
          $("button.keyboardD").toggleClass('active');
        }
        if(e.which == 70) {
          adlib.play('rim');
          $("button.keyboardF").toggleClass('active');
        }

    }
);



$( document ).on( "keyup",
    function(e) {
        if(e.which == 81) {
          $("button.keyboardQ").toggleClass('active');
        }
        if(e.which == 87) {
          $("button.keyboardW").toggleClass('active');
        }
        if(e.which == 69) {
          $("button.keyboardE").toggleClass('active');
        }
        if(e.which == 82) {
          $("button.keyboardR").toggleClass('active');
        }

        if(e.which == 65) {
          $("button.keyboardA").toggleClass('active');
        }
        if(e.which == 83) {
          $("button.keyboardS").toggleClass('active');
        }
        if(e.which == 68) {
          $("button.keyboardD").toggleClass('active');
        }
        if(e.which == 70) {
          $("button.keyboardF").toggleClass('active');
        }


    }
);


$( document ).ready(function() {
adlib.init({'urlPrefix':'https://s3.eu-west-2.amazonaws.com/jamesmaltby/codepen/audio/', 'sm2url':'/swf/'});
     adlib.load(['cowbell.mp3'],'cowbell');
        adlib.load(['crash.mp3'],'crash');
        adlib.load(['hihat.mp3'],'hihat');
        adlib.load(['hihatopen.mp3'],'hihatopen');

        adlib.load(['kick.mp3'],'kick');
        adlib.load(['snare.mp3'],'snare1');
        adlib.load(['snare2.mp3'],'snare2');
        adlib.load(['rim.mp3'],'rim');
        
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $("button").removeAttr("onmousedown");
        }
});