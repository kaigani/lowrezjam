/**
 * @author Kaigani <kai@kaigani.com>
 */


/**
 * An AudioHandler class for HTML5 Audio API 
 *
 * @module CTRL
 *
 */

/*
 * Begin closure
 */

(function(){

    "use strict";
/*
 * Start class function
 */

    var AudioHandler = function(){};

    var p = AudioHandler.prototype;

    // Properties
    p.context = new webkitAudioContext();
    p.buffer = null;

    p.dict = {};

    p.playSoundUrl = function(url,loop) {

        // Load asynchronously

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            
            p.buffer = p.context.createBuffer(request.response, false);
            p.playBuffer(loop);
        };

        request.onerror = function() {
            console.log("error loading");
        };

        request.send();
    };

    p.playBuffer = function(loop){

        loop = loop ? true : false;

        var source = p.context.createBufferSource();

        // Set buffer on source
        source.buffer = p.buffer;
        source.loop = loop;
        source.connect(p.context.destination);

        // Try to start sources at the same time
        //var time = context.currentTime + 0.020;
        source.start(0);
        
    };

    p.playSound = function(buffer, time){
    
        var source = p.context.createBufferSource();
    
        source.buffer = buffer;
        source.connect(p.context.destination);
        if (!source.start){
          source.start = source.noteOn;
        }
        source.start(time);
    };

    // Quick reference for assets names - no preloading, no error checking
    p.add = function(name,src){

        p.dict[name] = src;
    };

    p.play = function(name,loop){
        var src = p.dict[name];

        if(src){
            p.playSoundUrl(src,loop);
        }
    };

/*
 * End closure
 */

 this.AudioHandler = AudioHandler;

 // Server / Client module definition  seen on http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
 // Not going to worry about cross compatibility since this is a web library

}).call(this);