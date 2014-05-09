// Timer - for animation
//
// initialise with duration for a timer with a limit
//
// elapsed() Pass a reference, if the reference changes, the current time will be reset
// returns seconds, not milliseconds

(function(window){

window.Timer = function Timer(duration){

	var startTime = Date.now();
	var tag = null;

	this.reset = function(){
		startTime = Date.now();
	};

	this.elapsed = function(reference){
		if(reference && reference !== tag){
			tag = reference;
			startTime = Date.now();
			return 0;
		}else{
			return ( (Date.now() - startTime)/1000 );
		}
	};

	this.finished = function(){

		return (!duration || this.elapsed() > duration);
	};

	this.percentComplete = function(){

		var p = (duration > 0)?this.elapsed()/duration:1;
		if(p > 1) p = 1;

		return p;
	};
};


})(window);