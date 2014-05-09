(function(window){

	var id = 0;

window.Enemy = function Enemy(player){

	console.log("New enemy.");

	// PROTECTED
	var enemy = this;
	//var player = player; // always relative to player

	// PUBLIC
	this.id = ++id;
	this.mode = 'WALK'; // DEATH

	// enemy attributes
	this.width = 0.5; // 50cm
	this.height = 2; // 2m
	this.shootable = true;

	// movement
	this.distance = 100; // 100m
	this.direction = 0; // angle of direction

	// angle relative to player - shouldn't be a property -- to do remove
	//this.angle = 0;

	// load from animation
	this.frame = null;

	//var startTime = Date.now();
	var timer = new Timer();

	this.reset = function(){

		this.mode = 'WALK';
		this.distance = 100;
		this.direction = Math.random()*360;

		//startTime = Date.now();
		timer.reset();
	};

	this.update = function(){

		// Update angle between player and enemy
		//this.angle = angleBetween(polarToCartesian(1,player.direction),polarToCartesian(1,this.direction));

		//if(stage.count % 100 === 0 && this.distance > 1) this.distance--;
		if(this.distance > 1){
			if(this.mode === 'WALK') this.distance -= 0.01; // zombie speed setting TODO
		}else{
			this.mode = 'ATTACK'; // change to attack or thrash, etc.
		}

		//var currentTime = Date.now();
		this.frame = game.animation.getFrame('enemy_'+this.mode,timer.elapsed(this.mode));

		// animation has finished
		if(this.frame === null){
			
			if(this.mode === 'DEATH'){
				game.returnToPool(this);
			}else if(this.mode === 'ATTACK'){
				game.zombieAttack(); // attack at the end of an animation run
				timer.reset();
			}
		}

	};

	this.draw = function(ctx,x,y,w,h){

		if(enemy.mode === 'WALK'){
			ctx.fillStyle = 'rgb(0,255,0)';
		}else{
			ctx.fillStyle = 'rgb(255,128,128)';
		}

		if(w<1) w = 1;
		if(h<1) h = 1;

		w = Math.floor(w);
		h = Math.floor(h);

		//ctx.fillRect(x,y,w,h);
		//if(this.image && this.image.complete) ctx.drawImage(this.image,x,y,w,h);
		if(this.frame){

			var f = this.frame;

			ctx.drawImage(f.asset,f.sx,f.sy,f.sw,f.sh,x,y,w,h);
			//ctx.drawImage(f.asset,0,0,200,540,x,y,w,h);
			//debugger;
		}

	};

	this.shot = function(direction,elevation){

		//var hit = enemy.direction-direction; // not a good calculation - doesn't take distance into account

		if(this.mode === "WALK"){
			console.log("\tI'm shot:",direction,enemy.direction);

			enemy.mode = "DEATH";
			//startTime = Date.now();
			//timer.reset(); // mode should auto-reset the timer

			return true; // stop the bullet
		}

		return false; // pass through
		/*
		if(Math.abs(hit) < 0.1){
			console.log('Enemy',enemy.id,': HEADSHOT',hit);
			enemy.mode = 'DEATH';
			startTime = Date.now();
		}else if(Math.abs(hit) < 0.2){
			console.log('Enemy',enemy.id,': HIT',hit);
			enemy.mode = 'DEATH';
			startTime = Date.now();
		}else{
			console.log('Enemy',enemy.id,': MISS',hit);
		}
		*/
	};

/*
	this.draw = function(ctx){

		this.update();

		// Polar to Cartesian
		var p = {};
		p.x = player.position.x + this.distance * Math.cos(Math.rad(this.direction));
		p.y = player.position.y + this.distance * Math.sin(Math.rad(this.direction));

		var offset = canvas.width * (this.angle/view.fov);

		var viewWidth = view.projection(this.w,this.distance);
		var viewHeight = view.projection(this.h,this.distance);

		// Assumes enemy is taller than view eye height
		var hAbove = this.h - view.height;
		var hBelow = view.height;

		var viewAboveHorizon = view.projection(hAbove,this.distance);
		var viewBelowHorizon = view.projection(hBelow,this.distance);

		ctx.fillStyle = 'rgba(128,128,128,0.5)';
		ctx.fillRect(canvas.width/2+offset-viewWidth/2,canvas.height/2-viewAboveHorizon,viewWidth,viewHeight);

		// the head
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(canvas.width/2+offset-viewWidth/2,canvas.height/2-viewAboveHorizon,viewWidth,viewHeight/8);

		// draw sprite
		ctx.drawImage(this.image,canvas.width/2+offset-viewWidth/2,canvas.height/2-viewAboveHorizon,viewWidth,viewWidth);
	};

	this.debug = function(){

		var offset = canvas.width * (this.angle/view.fov);
		console.log('offset:',offset);

		var viewWidth = view.projection(this.w,this.distance);
		var viewHeight = view.projection(this.h,this.distance);

		console.log('viewWidth:',viewWidth);
		console.log('viewHeight:',viewHeight);

		// Assumes enemy is taller than view eye height
		var hAbove = this.h - view.height;
		var hBelow = view.height;

		console.log('hAbove:',hAbove);
		console.log('hBelow:',hBelow);

		var viewAboveHorizon = view.projection(hAbove,this.distance);
		var viewBelowHorizon = view.projection(hBelow,this.distance);

		console.log('viewAboveHorizon:',viewAboveHorizon);
		console.log('viewBelowHorizon:',viewBelowHorizon);

	};

*/
};

})(window);