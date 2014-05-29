// Closure for a global id object
(function(window){

// unique id for player
var id = 0;

//
// PLAYER class
//

window.Player = function Player(){

	console.log('New player.');

	// PROTECTED
	var player = this;

	var reloadTimer = new Timer(3); // reload in 3 seconds

	// PUBLIC
	this.id = ++id;

	// controls
	this.mode = 'STOP'; // LEFT, RIGHT, UP, DOWN -- DEATH
	this.reloading = false;
	this.bullets = 10;
	this.health = 100;

	//this.position = {x:100,y:100};

	this.direction = 0;
	//this.heading = $V([1,0]); // direction 0 = +x

	this.elevation = 90.0; // angle of elevation, 0 - horizon, range -90 to 90
	//this.pitch = null; // reserved

	this.reset = function(){

		this.mode = 'STOP';
		this.reloading = false;
		this.bullets = 10;
		this.health = 100;
		this.direction = 0;
		this.elevation = 90.0;
	};

	this.update = function(){

		// MOVEMENT
		var speed = (game.precision)?0.1:1;

		switch(player.mode){

			case 'LEFT':
				player.rotate(0-speed);
				break;

			case 'RIGHT':
				player.rotate(speed);
				break;

			case 'UP':
				player.tilt(0-speed);
				break;

			case 'DOWN':
				player.tilt(speed);
				break;
		}

		// RELOADING
		if(player.reloading){

			if(reloadTimer.finished()){
				player.bullets = 10;
				player.reloading = false;
			}else{
				var bulletsBefore = player.bullets;
				player.bullets = Math.floor( 10 * reloadTimer.elapsed()/3 );
				if(bulletsBefore != player.bullets) game.audio.play('reload');
			}
		}
	};

	/*this.draw = function(ctx){

		this.update();

	};*/

	//
	// PLAYER ACTIONS
	//

	//
	// Shoot
	//

	this.shoot = function(){

		if(!player.reloading){

			player.bullets--;

			if(player.bullets === 0){
				player.reloading = true;
				reloadTimer.reset();
			}

			// shot taken
			return true;
		}else{
			// reloading
			return false;
		}
	};

	//
	// Damage
	//

	this.damage = function(points){

		player.health -= points;
		if(player.health < 1){
			player.health = 0;
			player.mode = "DEATH";
			game.playerDied();
		}
	};

	// 
	// Movement - turnLeft(), turnRight(), tiltUp(), tiltDown()
	//

	this.turnLeft = function(){

		if(player.mode !== 'DEATH') player.mode = 'LEFT';
	};

	this.turnRight = function(){

		if(player.mode !== 'DEATH') player.mode = 'RIGHT';
	};

	this.tiltUp = function(){

		if(player.mode !== 'DEATH') player.mode = 'UP';
	};

	this.tiltDown = function(){

		if(player.mode !== 'DEATH') player.mode = 'DOWN';
	};


	//
	// CAMERA ACTIONS
	//

	this.setDirection = function(deg){

		deg = deg%360;
		if(deg<0) deg += 360;

		player.direction = deg;
		player.heading = $V([1,0]).rotate(Math.rad(deg),$V([0,0]));
	};

	// 360-degree rotation
	this.rotate = function(deg){

		this.setDirection(player.direction + deg);
	};

	this.setElevation = function(deg){

		if(deg < 45) deg = 45;
		if(deg > 135) deg = 135;

		player.elevation = deg;

	};

	// tilt within the range of 45 – 135
	this.tilt = function(deg){

		this.setElevation(player.elevation + deg);
	};
	
};

// End closure
})(window);