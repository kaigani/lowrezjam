(function(window){

	var id = 0;

window.Bullet = function Bullet(shotDirection,shotElevation){

	console.log("New bullet.");

	// PROTECTED
	var bullet = this;

	// PUBLIC
	this.id = ++id;
	this.mode = 'IMPACT';

	// attributes
	this.width = 0.1; // 10cm
	this.height = 0.1; // 10cm

	// position
	this.direction = shotDirection;

	// calculate distance when impact hits the ground
	if(shotElevation < 90){
		this.distance = game.view.height * Math.tan(Math.rad(shotElevation));
	}else{
		this.distance = Infinity;
	}

	console.log("Shot distance:",this.distance);

	// load from animation
	this.image = null;
	//this.image.src = 'assets/img/zombie.png';

	var timer = new Timer();

	this.update = function(){
	
		//this.image = game.animation.getFrame('enemy_'+this.mode,timer.elapsed(this.mode));
		// animate the bullet

	};

	this.draw = function(ctx,x,y,w,h){

		if(bullet.mode === 'IMPACT'){
			ctx.fillStyle = 'rgb(255,0,255)';
			ctx.fillRect(x,y,2,2);
		}
		//if(this.image && this.image.complete) ctx.drawImage(this.image,x,y,w,h);
	};

};

})(window);