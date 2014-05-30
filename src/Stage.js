window.Stage = function Stage(width,height){

	console.log("New Stage.");

	var stage = this;

	// PROTECTED

	// Display canvas
	var gCanvas = document.createElement('canvas');
	var gCtx = gCanvas.getContext('2d');

	gCanvas.style.position = 'absolute';
	//canvas.style.zIndex = '99';
	gCanvas.width = width;
	gCanvas.height = height;
	gCanvas.style.top = (document.body.clientHeight/2 - gCanvas.height/2)+'px';
	gCanvas.style.left = (document.body.clientWidth/2 - gCanvas.width/2)+'px';

	document.body.appendChild(gCanvas);

	// Working canvas - small, to be upscaled

	var imageData, bigData;
	var canvas = document.createElement('canvas');
	canvas.width = 32;
	canvas.height = 32;
	var c = canvas.getContext('2d');

	var bgImage = new Image();
	bgImage.src = 'assets/img/background-02-sm.png';

	var uiImage = new Image();
	uiImage.src = 'assets/img/ui_xl.png';

	var ui2Image = new Image();
	ui2Image.src = 'assets/img/ui_precision.png';

	var image = new Image();
	//image.src = 'assets/img/zombie.png';
	//image.onload = function(){

/*
		miniCtx.fillStyle = 'rgb(128,128,128)';
		miniCtx.strokeStyle = 'rgb(0,255,0)';
		miniCtx.fillRect(0,0,32,32);
		miniCtx.beginPath();
		miniCtx.moveTo(0,0);
		miniCtx.lineTo(32,32);
		miniCtx.stroke();

		miniCtx.drawImage(image,0,0,32,32);

		imageData = miniCtx.getImageData(0,0,32,32);
		bigData = scaleImageData(imageData,10);
*/

	//};

	// Stage objects - each should be able to draw itself
	this.objects = []; // make public

	// PUBLIC

	// CLEAR
	this.clear = function(){
		this.objects = [];
	};

	//
	// STAGE UPDATE
	//

	this.update = function(){

		// Clear the canvas
		c.clearRect(0, 0, canvas.width, canvas.height);

		// set a default fill & stroke
		c.fillStyle = 'rgb(214,236,236)';
		c.strokeStyle = 'rgb(64,64,64)';

		c.fillRect(0, 0, canvas.width, canvas.height);

		// draw the horizon
		c.strokeStyle = 'rgb(255,0,255)';
		c.beginPath();
		c.moveTo(0,canvas.height/2);
		c.lineTo(canvas.width,canvas.height/2);
		c.stroke();

		// draw ground
		var player = game.player;
		//var ground = 320 * game.view.horizonOffset(player.elevation);
		//c.fillStyle = 'rgb(0,128,0)';
		//c.fillRect(0,canvas.height-ground,canvas.width,ground);

		// draw the background image
		if(bgImage.complete){

			//canvasWidth = (game.precision)?canvas.width*10:canvas.width;
			//canvasHeight = (game.precision)?canvas.height*10:canvas.height;

			var bgOffsetX = -1*(game.player.direction/360)*canvas.width*12;
			var bgOffsetY = game.player.elevation-45;
			bgOffsetY /= 90;
			bgOffsetY = 1-bgOffsetY;
			bgOffsetY *= -1*canvas.height*3;

			var bgWidth = canvas.width * 12;
			var bgHeight = canvas.height * 4;

			c.drawImage(bgImage,bgOffsetX,bgOffsetY,bgWidth,bgHeight);
			c.drawImage(bgImage,bgOffsetX+bgWidth,bgOffsetY,bgWidth,bgHeight);

			if(game.precision){
				// sample from the centre
				var bgData = c.getImageData(15,15,3,3);
				var zoomData = scaleImageData(bgData,10);
				c.putImageData(zoomData,1,1);
			}
		}

		// SORT OBJECTS BY DISTANCE
		// reverse sort far to near
		this.objects.sort(function(a,b){
			return b.distance - a.distance;
		});

		//c.save();
		for(var i=0;i<this.objects.length;i++){

			var object = this.objects[i];
			//if(typeof currentObject.update === 'function') currentObject.update();

			//var objectRange = game.view.getRange(object.distance,object.w,object.h);
			//var region = game.view.getClippingRegion(objectRange,object.direction,player.direction,player.elevation);

			//if(region && object.constructor.name === 'Bullet') debugger;
			if(object.isLayer){
				// fullscreen layer, such as UI, point scores, or title cards
				object.draw(c,0,0,canvas.width,canvas.height);
			}else{
				var region = game.view.getProjection(object);
				object.draw(c,region.dx*canvas.width,region.dy*canvas.height,region.width*canvas.width,region.height*canvas.height);
			}
		}
		//c.restore();

		// draw the supposed view frame -- should be handled by view
		//c.strokeStyle = 'rgb(64,64,64)';
		//c.strokeRect(canvas.width/2-160,canvas.height/2-160,320,320);

		// draw the UI last
		//if(uiImage.complete && !game.precision) c.drawImage(uiImage,0,0,canvas.width,canvas.height);
		//if(ui2Image.complete && game.precision) c.drawImage(ui2Image,0,0,canvas.width,canvas.height);

		//c.putImageData(imageData,0,0);
		//if(bigData) c.drawImage(imageDataToCanvas(bigData),0,0);

	
/*
		if(region){

			c.fillStyle = 'rgb(255,0,255)';
			c.fillRect(region.dx*canvas.width,region.dy*canvas.height,region.width*canvas.width,region.height*canvas.height);

			guiData.region.isVisible = true;
			guiData.region.dx = region.dx*canvas.width;
			guiData.region.dy = region.dy*canvas.height;
			guiData.region.width = region.width*canvas.width;
			guiData.region.height = region.height*canvas.height;

		}else{
			guiData.region.isVisible = false;
		}
*/
		// UPSCALE & DRAW TO THE MAIN CANVAS
		var miniData = c.getImageData(0,0,32,32);
		var gCanvasData = scaleImageData(miniData,10);
		gCtx.putImageData(gCanvasData,0,0);

	};

	// very light stub
	this.addObject = function(o){
		this.objects.push(o);
	};

	this.removeObject = function(o){

		var i = this.objects.indexOf(o);
		if(i > -1) this.objects.splice(i,1);
	};


	// Event listeners - Window
	window.addEventListener('resize', handleResize, false);

	window.addEventListener('click', handleClick, false);
	window.addEventListener('touchend', handleClick, false);
    
 //   window.addEventListener('keydown', handleKeyDown, false);

	// Event handlers
	function handleClick(e) {

		// do something on click or touch
		var x = e.clientX;
		var y = e.clientY;

		//stage.update();

		//console.log(e);
		console.log("Clicked at: "+x+","+y);

	}
/*
	// key events bubble on a Mac - may need to make a timer on PC
	function handleKeyDown(e){
    
		switch(e.keyCode){

			// LEFT / A,a
			case 37:
			case 65: case 97:
				//console.log('Left/Anti-Clockwise');
				break;

			// UP / W,w
			case 38:
			case 87: case 199:
				//console.log('Up');
				break;

			// RIGHT / D,d
			case 39:
			case 68: case 100:
				//console.log('Right/Clockwise');
				break;

			// DOWN / S,s
			case 40:
			case 83: case 115:
				//console.log('Down');
				break;

			// Default
			default:
				console.log('Keycode: '+e.keyCode);
		}
	}
*/
	function handleResize(){

		// 320x320 - at centre of window

		//canvas.style.zIndex = '99';
		gCanvas.width = width;
		gCanvas.height = height;

		gCanvas.style.top = (document.body.clientHeight/2 - gCanvas.height/2)+'px';
		gCanvas.style.left = (document.body.clientWidth/2 - gCanvas.width/2)+'px';
	}

};

// Start the animation loop
Stage.prototype.start = function(){

	var stage = this;

	function loop(){

		stage.count++;

		// Update FPS
		this.timestamp = (this.timestamp)?this.timestamp:Date.now();
		var newTimestamp = Date.now();
		var elapsed_ms = newTimestamp - this.timestamp;
		var FPS = Math.floor( 1000 / elapsed_ms );
		this.timestamp = newTimestamp;

		// debounce - sample FPS every second
		if(stage.count%30 === 0) stage.FPS = FPS;
		

		// UPDATE STAGE
		stage.update();

		// Animation
		requestAnimFrame(loop);
	}

	loop();
	
};

//
// Canvas Helper functions
//

tmpCanvas = document.createElement('canvas');
tmpCtx = tmpCanvas.getContext('2d');

var createImageData = function(w, h) {
	return tmpCtx.createImageData(w, h);
};

var imageDataToCanvas = function(imageData) {
    var canvas = newCanvas(imageData.width, imageData.height);
    canvas.getContext('2d').putImageData(imageData, 0, 0);
    return canvas;
};

var newCanvas = function(w,h) {
	var c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return c;
};

var scaleImageData = function(imageData,scale){

	scale = (scale>0)?scale:1;

	var output = createImageData(imageData.width*scale, imageData.height*scale);
	var w = imageData.width;
	var h = imageData.height;
	var dst = output.data;
	var d = imageData.data;

	for (var y=0; y<h; y++) {
		for (var x=0; x<w; x++) {

			var p = getPixel(imageData,x,y);

			var offsetX = x*scale;
			var offsetY = y*scale;
			for(var outY=0; outY<scale; outY++){
				for(var outX=0; outX<scale;outX++){

					setPixel(output,p,outX+offsetX,outY+offsetY);
				}
			}
			//setPixel(output,p,x*2,y*2);
			//setPixel(output,p,x*2+1,y*2);
			//setPixel(output,p,x*2,y*2+1);
			//setPixel(output,p,x*2+1,y*2+1);
		}
	}
	return output;
};

var getPixel = function(imageData,x,y){

	var w = imageData.width;
	var h = imageData.height;
	var off = (y*w+x)*4;
	var d = imageData.data;

	return { r: d[off], g: d[off+1], b: d[off+2], a: d[off+3] };
};

var setPixel = function(imageData,p,x,y){

	var w = imageData.width;
	var h = imageData.height;
	var off = (y*w+x)*4;
	var d = imageData.data;

	d[off] = p.r;
	d[off+1] = p.g;
	d[off+2] = p.b;
	d[off+3] = p.a;
};



