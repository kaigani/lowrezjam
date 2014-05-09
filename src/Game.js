window.Game = function Game(){

	console.log('New game.');

	// SETTINGS
	this.settings = {

		assetPath : 'assets/img/' , 
	};

	// PROTECTED
	var game = this;

	var objectPool = [];

	var titleLayer = new TextLayer();

	// PUBLIC

	// Game core
	this.loader = null;
	this.animation = null;
	this.stage = null;
	this.view = null;
	this.player = null;
	this.enemy = null;
	//this.enemies = [];

	// layers
	this.guiLayer = null;

	// controls
	this.mode = 'START'; // TITLE, BEGIN, RUN, END, SCORE
	this.precision = false;
	this.zoom = 10;

	// properties
	this.count = 0; // running frame count
	this.FPS = 0;


	// INITIALISE GAME 
	this.load = function(){

		// Functional classes
		this.loader = new html5Preloader();
		this.animation = new Animation(this.loader);

		// Initialise stage & game objects
		this.stage = new Stage(320,320);
		this.view = new View();

		this.guiLayer = new GuiLayer();

		this.player = new Player();
		//stage.addObject(player); // don't need on the stage - player will not be drawn

		// TODO - REMOVE GAME SETUP - now in startNewGame()
		this.enemy = new Enemy(game.player);

	};

//
// TODO - remove these temporary tests
//

	this.testText = function(){
		var textLayer = new TextLayer();
		textLayer.renderText('abcdefghijklmnopqrstuvwxyz');
		textLayer.loop = true;
		game.stage.addObject(textLayer);

		var i = 0;

		setTimeout(function(){
			console.log('test point',++i);
			textLayer.color = 'rgb(255,0,0)';
		},1000);

		setTimeout(function(){
			console.log('test point',++i);
			textLayer.small = false;
			textLayer.renderText('0123456789');
			textLayer.mode = "SCROLL-LEFT";
		},2500);

		setTimeout(function(){
			console.log('test point',++i);
			textLayer.speed = 10;
			textLayer.overlay = false;
		},3000);

		setTimeout(function(){
			console.log('test point',++i);
			textLayer.color = 'CYCLE';
		},5000);

		setTimeout(function(){
			console.log('test point',++i);
			textLayer.mode = "SCROLL-UP";
			textLayer.overlay = true;
		},10000);

		setTimeout(function(){
			console.log('test point',++i);
			textLayer.loop = false;
		},12000);

	};

	this.testTextHack = function(){
		var textLayer = new TextLayer(15); // 15 sec timer
		textLayer.sprite = game.animation.getSprite('titleCard');
		//textLayer.renderText("zombie sniper");
		//textLayer.loop=true;
		textLayer.speed=5;
		game.stage.addObject(textLayer);

		setTimeout(function(){
			textLayer.small = false;
			textLayer.renderText('zombie sniper');
			textLayer.mode = 'SCROLL-LEFT';
		},12000);

		textLayer.onComplete = function(){
			console.log("We're done here!");
			textLayer.reset();
			textLayer.mode = 'SCROLL-UP';
			console.log("Start it again!");
			game.stage.addObject(textLayer);
		};
	};

	// test a sprite animation
	this.testSpriteLayer = function(){

		var spriteLayer = new SpriteLayer(1); // 1 sec timer - should wait until scroll complete
		spriteLayer.sprite = game.animation.getSprite('titleCard');
		spriteLayer.speed = 5;
		spriteLayer.mode = 'SCROLL-LEFT';

		game.stage.addObject(spriteLayer);
		spriteLayer.onComplete = function(){
			console.log("Sprite is done.");
		};
	};

	this.update = function(){

		switch(game.mode){

			case 'START':
				showTitleSequence();
			break;

			case 'TITLE':
				// do nothing -- any key trigger game start
			break;

			case 'BEGIN':
				startNewGame();
			break;

			case 'RUN':
				game.player.update(); // not on the stage
			break;

			case 'END':
				showDeathSequence();
			break;

			case 'SCORE':
				// do nothing
			break;

			default:
				//console.warn('Game mode not handled!');
			break;
		}

		// not sure why i'm doing this here, not stage ... TODO
		game.stage.objects.forEach(function(object){
			if(typeof object.update === 'function') object.update();
		});
		game.stage.update();

	};

	//
	// SCENE management
	//

	function showTitleSequence(){

		game.mode = 'TITLE';
		console.log('Start title sequence.');

		titleLayer = new TextLayer(3); // a hack on TextLayer
		titleLayer.sprite = game.animation.getSprite('titleCard');
		//titleLayer.loop=true;
		titleLayer.speed=5;

		//var spriteLayer = new SpriteLayer(0); // 1 sec timer - should wait until scroll complete
		//spriteLayer.sprite = game.animation.getSprite('titleCard');
		//spriteLayer.speed = 5;
		titleLayer.mode = 'DEFAULT';
		game.stage.addObject(titleLayer);

		var loopCount = 2;
		
		titleLayer.onComplete = function(){
			console.log("Title cycle complete.");

			titleLayer.reset();
			loopCount--;

			if(loopCount > 0){

				titleLayer.small = false;
				titleLayer.renderText('Zombie Sniper');
				titleLayer.dx = 32;
				titleLayer.mode = 'SCROLL-LEFT';
			}else{

				loopCount = 2;
				titleLayer.sprite = game.animation.getSprite('titleCard');
				titleLayer.mode = 'DEFAULT';
			}

			game.stage.addObject(titleLayer);
			//game.mode = 'BEGIN';
		};
		


	}

	function startNewGame(){

		console.log('Start new game.');

		game.mode = 'RUN';

		var i;
		for(i=0;i<100;i++){
			var enemy = new Enemy(game.player);
			enemy.direction = Math.random()*360;
			enemy.distance = Math.random()*60 + 20;
			game.stage.addObject(enemy);
			//game.enemies.push(enemy); // need this?
		}

		for(i=0;i<20;i++){
			var obstacle = new Obstacle();
			game.stage.addObject(obstacle);
		}

		//this.guiLayer = new GuiLayer();
		game.stage.addObject(game.guiLayer);

	}

	function showDeathSequence(){

		game.mode += '_running';
		game.stage.clear();

		console.log('Show death sequence.');

		var textLayer = new TextLayer(0); // should wait until scroll complete
		textLayer.renderText("You Died");
		textLayer.dy = 12;
		textLayer.dx = 32;
		//spriteLayer.sprite = game.animation.getSprite('titleCard');
		textLayer.speed = 5;
		textLayer.color = 'rgb(255,0,0)';
		textLayer.mode = 'SCROLL-LEFT';

		game.stage.addObject(textLayer);
		textLayer.onComplete = function(){
			console.log("Death sequence complete.");
			game.player.reset();
			game.mode = 'START';
		};
	}


	// CORE ACTIONS - - - - - - - 

	//
	// Shoot
	//

	this.shoot = function(){

		if(game.player.shoot()){

			console.log("Shot taken!");

			game.guiLayer.shoot();

			// determine shot angle direction & elevation with slight random offset within 1 degree
			var randomX = Math.random() - 0.5;
			var randomY = Math.random() - 0.5;

			//game.player.direction += randomX;
			//game.player.elevation += randomY;

			var shotDirection = game.player.direction;// + randomX;
			var shotElevation = game.player.elevation;// + randomY;
			var hitRadius = 0.2;
			var impact = false;

			// enemies handle whether or not they are hit --- wrong
			for(var i=0;i<game.stage.objects.length;i++){

				var object = game.stage.objects[i];

				if(object.shootable && game.view.checkCollision(object,shotDirection,shotElevation,hitRadius)){
					console.log("Object",object.constructor.name,"[",object.id,"] hit");
					impact = object.shot(shotDirection,shotElevation); // for precision
					if(impact) break; // impacted
				}
			}

			if(!impact){
				console.log('Miss!');
				var bullet = new Bullet(shotDirection,shotElevation);
				game.stage.addObject(bullet);
			}

		}else{
			console.log("Didn't shoot.");
		}
			
	};

	//
	// Zoom In / Out
	//

	this.zoomIn = function(){

		if(!game.precision){
			// don't zoom multiple times
			game.precision = true;
			game.view.fov /= game.zoom; // magnification silly way to do it

			game.guiLayer.zoom = true;
		}
	};

	this.zoomOut = function(){

		if(game.precision){
			game.precision = false;
			game.view.fov *= game.zoom;

			game.guiLayer.zoom = false;
		}
	};

	// 
	// SHOULD BE EVENTS
	//

	this.zombieAttack = function(){

		var damage = Math.floor(Math.random()*10)+1;

		console.log("Attack for damage: "+damage);
		game.player.damage(damage);
		game.stage.addObject( new DamageLayer() );

		// TODO - flash the gui red
	};

	this.playerDied = function(){

		if(game.mode === 'RUN') game.mode = 'END';
	};


	//
	// - - - - - - - - - - - 
	//

	// Game object managment / memory management

	// return objects to the pool, removing them from the stage
	this.returnToPool = function(object){

		console.log("Returned object to pool:",object.constructor.name,object.id);
		game.stage.removeObject(object);
		objectPool.push(object);
	};


	//
	// - - - - - - - - - - - 
	//

	// EVENT LISTENERS
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);


	// EVENT HANDLERS
	// key events bubble on a Mac - may need to make a timer on PC
	function handleKeyDown(e){

		if(game.mode === 'TITLE'){
			game.mode = 'BEGIN';
			game.stage.removeObject(titleLayer);
			return;
		}
    
		switch(e.keyCode){

			// LEFT / A,a
			case 37:
			case 65: case 97:
				//console.log('Player: Left/Anti-Clockwise');
				//game.player.mode = 'LEFT';
				game.player.turnLeft();
				//player.rotate(-1);
				break;

			// UP / W,w
			case 38:
			case 87: case 199:
				//console.log('Player: Up');
				//game.player.mode = 'UP';
				game.player.tiltUp();
				//player.tilt(-5);
				break;

			// RIGHT / D,d
			case 39:
			case 68: case 100:
				//console.log('Player: Right/Clockwise');
				//game.player.mode = 'RIGHT';
				game.player.turnRight();
				//player.rotate(1);
				break;

			// DOWN / S,s
			case 40:
			case 83: case 115:
				//console.log('Player: Down');
				//game.player.mode = 'DOWN';
				game.player.tiltDown();
				//player.tilt(5);
				break;

			// SHIFT = precision
			case 16:
				game.zoomIn();
				break;

			// SPACE = shoot
			case 32:
				game.shoot();
				break;

			// Default
			default:
				//console.log('Player: Keycode: '+e.keyCode);
		}
	}

	function handleKeyUp(e){

		if(e.keyCode === 16){
			game.zoomOut();
		}else{
			game.player.mode = 'STOP'; // should really check which key
		}

	}
	
};

// Start the game loop
Game.prototype.start = function(){

	var game = this;

	function loop(){

		game.count++;

		// Update FPS
		this.timestamp = (this.timestamp)?this.timestamp:Date.now();
		var newTimestamp = Date.now();
		var elapsed_ms = newTimestamp - this.timestamp;
		var FPS = Math.floor( 1000 / elapsed_ms );
		this.timestamp = newTimestamp;

		// debounce - sample FPS every second
		if(game.count%30 === 0) game.FPS = FPS;
		
		// UPDATE STAGE
		game.update();

		// Animation
		requestAnimFrame(loop);
	}

	loop();
	
};

