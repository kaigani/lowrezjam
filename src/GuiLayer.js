//
// GUI Layer - shows either the default or precision view UI
// -- draws details on top for health and bullets
//

(function(window){

	var id = 0;

window.GuiLayer = function GuiLayer(){

	console.log("New GuiLayer.");

	// PROTECTED
	var guiLayer = this;

	// PUBLIC
	this.id = ++id;
	this.mode = 'DEFAULT'; // SHOOT
	this.zoom = false;

	// attributes
	this.width = 1; // no effect
	this.height = 1; // no effect
	this.shootable = false; // pass through
	this.isLayer = true;

	// position
	this.distance = -10; // place other layers relative to this in negative distance
	this.direction = 0; // no effect

	// load from animation
	this.sprite = null; // zoom sprite
	this.frame = null; // shooting animation

	var timer = new Timer();

	this.update = function(){
	
		this.sprite = (this.zoom)?game.animation.getSprite('gui_ZOOM'):null;

		// animation - shooting - could use the timer alone, but -- legacy
		this.frame = game.animation.getFrame('gui_'+this.mode,timer.elapsed(this.mode));

		// revert to default if animation is complete (for shooting)
		if(this.frame === null){
			this.mode = 'DEFAULT';
			this.frame = game.animation.getSprite('gui_DEFAULT');
		}

	};

	this.draw = function(ctx,x,y,w,h){

		//ctx.fillStyle = 'rgba(255,255,255,0.9)';
		//ctx.fillRect(x,y,w,h);

		if(this.sprite){
			var img = this.sprite;
			ctx.drawImage(img.asset,img.sx,img.sy,img.sw,img.sh,x,y,w,h);
		}

		if(this.frame){
			var f = this.frame;
			ctx.drawImage(f.asset,f.sx,f.sy,f.sw,f.sh,x,y,w,h);
		}

		// DRAW HEALTH & BULLETS

		// Red bar
		ctx.fillStyle = 'rgb(238,28,36)';
		ctx.fillRect(1,0,30,1);

		// Health bar
		var healthBar = Math.floor( 30 * game.player.health/100 );
		if(healthBar === 0 && game.player.health > 0) healthBar = 1;
		ctx.fillStyle = 'rgb(58,180,74)';
		ctx.fillRect(1,0,healthBar,1);

		// Bullets remaining
		for(var i=0;i<10;i++){

			if(i < game.player.bullets){
				ctx.fillStyle = (game.player.reloading)?'rgb(128,128,128)':'rgb(255,236,80)';
			}else{
				ctx.fillStyle = 'rgb(0,0,0)';
			}

			var offset = i * 2 + 3;
			offset = (i<5)?offset:offset+7;

			ctx.fillRect(offset,31,1,1);
		}
	};

	this.shoot = function(){

		this.mode = 'SHOOT';
	};

};

})(window);