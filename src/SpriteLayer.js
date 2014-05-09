//
// SpriteLayer - a sprite card, scrolls left, right, up, down
//

(function(window){

	var id = 0;

window.SpriteLayer = function SpriteLayer(duration){

	console.log("New SpriteLayer.");

	// optional duration or 3 sec
	duration = duration || 3;

	// PROTECTED
	var spriteLayer = this;

	// PUBLIC
	this.id = ++id;
	this.mode = 'DEFAULT'; // SCROLL-LEFT, SCROLL-UP, TEST - runs the font test
	this.small = true;
	this.color = 'CYCLE'; // or set to an RGBA string
	this.loop = false;
	this.speed = 1; // scrolling speed
	this.overlay = true; // creates a darkened background

	// callback - should use events...
	this.onComplete = null;

	// Stage attributes
	this.width = 1; // no effect
	this.height = 1; // no effect
	this.shootable = false; // pass through
	this.isLayer = true;

	// Stage position
	this.distance = -20; // in front of gui layer
	this.direction = 0; // no effect

	// Sprite
	this.sprite = null; // text sprite

	// Drawing offset
	this.dx = 0;
	this.dy = 0;

	// Animation timer
	var timer = new Timer(duration); // also used for duration when there is no looping

	this.reset = function(){

		timer.reset();
	};


	this.update = function(){

		// animation

		// frame count - for speed
		var fc = Math.floor(30/spriteLayer.speed);
		if(fc < 1) fc=1;

		switch(this.mode){

			case 'DEFAULT':
				if(!spriteLayer.loop && timer.finished()){
					game.returnToPool(this);

					// callback
					if(this.onComplete){
						this.onComplete();
					}
				}
			break;

			case 'SCROLL-LEFT':

				if(game.count % fc === 0){
					spriteLayer.dx--;
					if(spriteLayer.dx+spriteLayer.sprite.sw < 0){
						spriteLayer.dx = 32; // TODO: have to hack this in for now
						if(!spriteLayer.loop) this.mode = 'DEFAULT'; // scroll complete, revert to normal
					}
				}
			break;

			case 'SCROLL-UP':

				if(game.count % fc === 0){
					spriteLayer.dy--;
					if(spriteLayer.dy < -1 * spriteLayer.sprite.sh){
						spriteLayer.dy = 32; // have to hack this in for now
						if(!spriteLayer.loop) this.mode = 'DEFAULT'; // scroll complete, revert to normal
					}
				}
			break;
		}
	};

	this.draw = function(ctx,x,y,w,h){

		if(spriteLayer.overlay){
			ctx.fillStyle = 'rgba(64,64,64,0.9)';
			ctx.fillRect(x,y,w,h);
		}

		var dx = this.dx;
		var dy = this.dy;

		if(this.sprite){
			var i = this.sprite;

			ctx.drawImage(i.asset,x+dx,y+dy,w,h); // clipping region doesn't seem to work -- TODO: debug

		}

	};
	

};

})(window);