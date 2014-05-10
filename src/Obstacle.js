//
// Obstacle - generic object - can explode
//

(function(window){

	var id = 0;

window.Obstacle = function Obstacle(width,height,distance,direction){

	console.log("New Obstacle.");

	// PROTECTED
	var obstacle = this;

	// PUBLIC
	this.id = ++id;
	this.mode = 'INERT';

	// attributes
	this.width = width || 1; // 1m default
	this.height = height || 1; // 1m default
	this.shootable = true;
	this.isLayer = false; // don't need this, but since obstacles are my generic object class, included for completeness

	// position
	this.distance = distance || Math.random()*100; // randomly placed within 100m default
	this.direction = direction || Math.random()*360; // random direction default

	// load from animation
	//this.image = new Image();
	//this.image.src = 'assets/img/hires.jpg';
	this.sprite = null;

	var timer = new Timer();

	this.update = function(){

		// animate explosions...
		this.sprite = game.animation.getSprite('obstacle_FACE');

	};

	this.draw = function(ctx,x,y,w,h){

		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.fillRect(x,y,w,h);

		if(this.sprite){
			var f = this.sprite;
			//ctx.drawImage(f.asset,f.sx,f.sy,f.sw,f.sh,x,y,w,h);
		}
	};

	this.shot = function(direction,elevation){

		console.log("Obstacle [",obstacle.id,"] blocks shot");
		return true;
	};

};

})(window);