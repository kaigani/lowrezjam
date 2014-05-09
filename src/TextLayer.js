//
// TextLayer - a title card, message, or scrolling messages
//

(function(window){

	var id = 0;

window.TextLayer = function TextLayer(duration){

	console.log("New TextLayer.");

	// optional duration or 3 sec
	duration = duration || 3;

	// PROTECTED
	var textLayer = this;

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

	// overprint buffer - to render text colour
	var buffer = document.createElement('canvas');
	var bufferCtx = buffer.getContext('2d');

	// Animation timer
	var timer = new Timer(duration); // also used for duration when there is no looping

	// Update data
	var alphaString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var test_i = 0;

	// Initialise the text sprite with text
	this.renderText = function(text){

		text = text.toUpperCase();

		//var characterSprites = []; // contains all the sprites for the text
		var font = (this.small)?'pixelArtM':'bannerFont';
		var i,c,sprite,cursor;

		// Scrolling - each separated by 1px small, 2px large
		var scrollWidth = 0;
		var scrollHeight = 3; // no less than 3

		// Measure the text
		for(i=0;i<text.length;i++){
			c = text[i];
			sprite = game.animation.getSprite(font+'_'+c); // space = null

			if(sprite){
				scrollWidth += sprite.sw;
				if(sprite.sh > scrollHeight) scrollHeight = sprite.sh;
			}else{
				// space
				if(textLayer.small){
					scrollWidth += 3;
				}else{
					scrollWidth += 9;
				}
			}

			// kerning - add space to each except last
			if(i < text.length-1){
				scrollWidth = (textLayer.small)?scrollWidth+1:scrollWidth+2;
			}
		}

		// Create the canvas & draw the text
		var textCanvas = document.createElement('canvas');
		var textCtx = textCanvas.getContext('2d');
		textCanvas.width = scrollWidth;
		textCanvas.height = scrollHeight;
		textLayer.sprite = { asset: textCanvas, sx:0, sy:0, sw:scrollWidth, sh:scrollHeight };

		// Draw the text onto the text canvas
		for(i=0, cursor=0;i<text.length;i++){
			c = text[i];
			sprite = game.animation.getSprite(font+'_'+c); // space = null

			if(sprite){

				// draw it
				textCtx.drawImage(sprite.asset,sprite.sx,sprite.sy,sprite.sw,sprite.sh,cursor,0,sprite.sw,sprite.sh);

				// advance the cursor
				cursor += sprite.sw;
				
			}else{
				// space
				if(textLayer.small){
					cursor += 3;
				}else{
					cursor += 9;
				}
			}

			// kerning - add space to each except last
			if(i < text.length-1){
				cursor = (textLayer.small)?cursor+1:cursor+2;
			}
		}

		console.log("Text layer rendered.");
	};

	// TODO - reset all values!
	
	this.reset = function(){

		timer.reset();
		this.dx = 0;
		this.dy = 0;
	};


	this.update = function(){

		/*
		if(!textLayer.loop && timer.finished()){
			game.returnToPool(this);

			// callback
			if(this.onComplete){
				this.onComplete();
			}
		}
		*/

		//var chr = alphaString[test_i];

		//var font = (this.small)?'pixelArtM':'bannerFont';
		//this.sprite = game.animation.getSprite(font+'_'+chr);

		// animation

		/*
		if(game.count % 30 === 0){
			test_i++;
			if(test_i === alphaString.length){
				test_i = 0;
				toggleFont = !toggleFont;
			}
		}
		*/

		// frame count - for speed
		var fc = Math.floor(30/textLayer.speed);
		if(fc < 1) fc=1;

		switch(this.mode){

			case 'DEFAULT':
				if(!textLayer.loop && timer.finished()){
					game.returnToPool(this);

					// callback
					if(this.onComplete){
						this.onComplete();
					}
				}
			break;

			case 'SCROLL-LEFT':

				if(game.count % fc === 0){
					textLayer.dx--;
					if(textLayer.dx+textLayer.sprite.sw < 0){
						textLayer.dx = 32; // TODO: have to hack this in for now
						if(!textLayer.loop) this.mode = 'DEFAULT'; // scroll complete, revert to normal
					}
				}
			break;

			case 'SCROLL-UP':

				if(game.count % fc === 0){
					textLayer.dy--;
					if(textLayer.dy < -1 * textLayer.sprite.sh){
						textLayer.dy = 32; // have to hack this in for now
						if(!textLayer.loop) this.mode = 'DEFAULT'; // scroll complete, revert to normal
					}
				}
			break;
		}
	};

	this.draw = function(ctx,x,y,w,h){

		if(textLayer.overlay){
			ctx.fillStyle = 'rgba(64,64,64,0.9)';
			ctx.fillRect(x,y,w,h);
		}

		//ctx.fillStyle = 'rgb(255,255,255)';

		buffer.width = w;
		buffer.height = h;

		var dx = this.dx;
		var dy = this.dy;

		if(this.sprite){
			var i = this.sprite;

			if(textLayer.color === 'CYCLE'){

				var slowCount = Math.floor(game.count/5);

				var r = (slowCount & 1)?255:0;
				var g = (slowCount & 2)?255:0;
				var b = (slowCount & 4)?255:0;

				bufferCtx.fillStyle = 'rgb('+r+','+g+','+b+')';
			}else{
				bufferCtx.fillStyle = textLayer.color;
			}
			//bufferCtx.fillRect(12,0,i.sw,i.sh);
			//ctx.fillRect(12,0,i.sw,i.sh);

			//bufferCtx.drawImage(i.asset,i.sx,i.sy,i.sw,i.sh,x,y,i.sw,i.sh);
			bufferCtx.drawImage(i.asset,x+dx,y+dy,i.sw,i.sh); // clipping region doesn't seem to work -- TODO: debug

			bufferCtx.globalCompositeOperation = 'source-atop';
			bufferCtx.fillRect(0,0,w,h);
			bufferCtx.globalCompositeOperation = 'source-over';
		}

		ctx.drawImage(buffer,0,0,w,h);
		//ctx.drawImage(this.sprite.asset,x+dx,y+dy,w,h);
		
/*
		if(this.frame){
			var f = this.frame;
			ctx.drawImage(f.asset,f.sx,f.sy,f.sw,f.sh,x,y,w,h);
		}
*/
	};
	

};

})(window);