//
// DamageLayer - turns red and fades to transparent to reflect damage
//

(function(window){

	var id = 0;

window.DamageLayer = function DamageLayer(){

	console.log("New DamageLayer.");

	// PROTECTED
	var damageLayer = this;

	// PUBLIC
	this.id = ++id;
	this.mode = 'DEFAULT'; // no effect

	// attributes
	this.width = 1; // no effect
	this.height = 1; // no effect
	this.shootable = false; // pass through
	this.isLayer = true;

	// position
	this.distance = -30; // top most layer (so far)
	this.direction = 0; // no effect

	// no animation used
	this.frame = null; // unused

	var timer = new Timer(0.5); // 0.5 second

	this.update = function(){
	
		// check if finished
		if(timer.finished()){
			game.returnToPool(this);
		}

	};

	this.draw = function(ctx,x,y,w,h){

		var opacity = 1-timer.percentComplete();

		ctx.fillStyle = 'rgba(255,0,0,'+opacity+')';
		ctx.fillRect(x,y,w,h);

	};

	this.shoot = function(){

		this.mode = 'SHOOT';
	};

};

})(window);