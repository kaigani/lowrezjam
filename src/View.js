function View(){

	console.log("New view.");

	var view = this;
	
	this.focalLength = 0.3; // 30cm
	this.fov = 30; // degrees visible horizontally

	this.height = 1.8; // 180cm - eye height

	this.pixelScale = 4200; // pixels per m
/*
	this.proj_x = function(x,distance){
		return this.pixelScale * x * (this.focalLength/distance);
	};

	this.proj_y = function(y,distance){
		return this.pixelScale * y * (this.focalLength/distance);
	};

	this.projection = function(value,distance){
		return this.pixelScale * value * (this.focalLength/distance);
	};

	this.isVisible = function(heading,angleTowardsObject,debug){

		/*
		var leftOfHeading = heading-this.fov/2;
		var rightOfHeading = heading+this.fov/2;

		if(debug) console.log(leftOfHeading,rightOfHeading);

		return(
			( leftOfHeading < angleTowardsObject && rightOfHeading > angleTowardsObject) ||
			( leftOfHeading < angleTowardsObject+360 && rightOfHeading > angleTowardsObject+360 )
		);
*/
/*
		var angle = angleBetween(polarToCartesian(1,heading),polarToCartesian(1,angleTowardsObject));
		if(debug) console.log(angle);
		return( Math.abs(angle) < this.fov/2 );
	};

	// returns the percentage 0-100 from ground to horizon
	// given the angle of elevation
	// angle: 90 = 50%

	this.horizonOffset = function(elevation){

		var upper = elevation + this.fov/2;
		var lower = elevation - this.fov/2;

		//console.log(lower,upper,this.fov);

		if(upper < 90){
			// upper is below horizon
			return 1;
		}else
		// upper is at or above horizon
		if(lower >= 90){
			// upper & lower are above horizon
			return 0;
		}else{
			// upper is above horizon, lower is below
			return (90-lower)/this.fov;
		}
	};

	// calculate the {lower:n,upper:n} in percentage of view from bottom to lower bound, lower bound to upperbound
	// for instance {lower:10,upper:30} has 10% offset from ground and 20% of the view as the figure
	this.verticalRange = function(d,h){

		var depression, elevation;
		var lower, upper;

		depression = Math.deg(Math.atan(this.height/d));
		lower = 90-depression;

		elevation = Math.deg(Math.atan((h-this.height)/d));
		upper = 90+elevation;

		return( {lower:lower,upper:upper} );
	};

	// horizontal range offset from the perpendicular line from player to object
	this.horizontalRange = function(d,w){

		var left = Math.deg(Math.atan((w/2)/d));
		var right = Math.deg(Math.atan((w/2)/d));

		return({left:left,right:right});
	};

	this.getRange = function(d,w,h){

		d = d / this.focalLength; // not accurately measured -- TODO: change this

		var o = {};
		var vR = this.verticalRange(d,h);
		var hR = this.horizontalRange(d,w);

		o.left = hR.left;
		o.right = hR.right;
		o.lower = vR.lower;
		o.upper = vR.upper;

		return o;
	};

// /*
// Not sure this works...

	this.projectedDistanceBetween = function(d,rotation1,elevation1,rotation2,elevation2){

		// normalise angles
		if(rotation1 > 180 && rotation2 < 180) rotation1 += 360;
		if(rotation1 < 180 && rotation2 > 180) rotation2 += 360;

		var dx = rotation2 - rotation1;

		if(dx > 90) return Infinity;

		// normalise angles
		if(elevation1 > 180 && elevation2 < 180) elevation1 += 360;
		if(elevation1 < 180 && elevation2 > 180) elevation2 += 360;

		var dy = elevation2 - elevation1;

		if(dy > 90) return Infinity;

		var offsetX = d * Math.tan(dx);
		var offsetY = d * Math.tan(dy);

		var distance = Math.sqrt(Math.pow(offsetX,2)+Math.pow(offsetY,2));

		return distance;
	};
*/
/*
	// given a direction and an elevation, returns percentage of view as defined by
	// clipping region dx,dy,width,height 
	this.getClippingRegion = function(objectRange,objectDirection,viewDirection,viewElevation){

		var dx,dy,clipW,clipH,width,height;
		var left,right,upper,lower;

		// HORIZONTAL
		if(viewDirection > 180 && objectDirection < 180) objectDirection += 360; // normalise angles
		if(viewDirection < 180 && objectDirection > 180) viewDirection += 360; // normalise angles
		
		var viewLeft = viewDirection - this.fov/2;
		var viewRight = viewDirection + this.fov/2;
		var objectLeft = objectDirection - objectRange.left;
		var objectRight = objectDirection + objectRange.right;

		width = objectRight-objectLeft;
		clipW = width;

		if(viewLeft > objectRight || viewRight < objectLeft){
			// out of bounds
			return null;
		}

		//if(viewLeft > objectLeft){
			left = objectLeft-viewLeft;
			//clipW += left;

		//}else{
			left = objectLeft-viewLeft; // positive
		//}

		if(viewRight > objectRight){
			right = viewLeft-objectRight;
		}else{
          right = objectRight; // out of bounds also
			clipW -= objectRight - viewRight;
		}

		// VERTICAL
		
		var viewUpper = viewElevation + this.fov/2;
		var viewLower = viewElevation - this.fov/2;

		height = objectRange.upper - objectRange.lower;
		clipH = height;

		if(viewUpper < objectRange.lower || viewLower > objectRange.upper){
			// out of bounds
			return null;
		}

		//if(viewUpper < objectRange.upper){
		//	upper = 0;
		//	clipH -= objectRange.upper - viewUpper;

		//}else{
			upper = viewUpper - objectRange.upper;
		//}

		//if(viewLower > objectRange.lower){
		//	lower = viewLower;
		//	clipH -= viewLower - objectRange.lower;
		//}else{
		//	lower = objectRange.lower;
		//}

		// CONVERT TO PERCENTAGES OF FOV
		var o = {};
		o.dx = left / this.fov;
		o.dy = upper / this.fov;
		//o.clipW = clipW / this.fov;
		//o.clipH = clipH / this.fov;
		o.width = width / this.fov;
		o.height = height / this.fov;

		return o;

	};
*/
	// getProjection
	// given a view with: view.height, view.direction, view.elevation
	// takes an object with: object.width,object.height,object.direction, object.distance
	// returns (in % of viewable area), {dx,dy,width,height}

	this.getProjection = function(object){

		var viewDirection = game.player.direction;
		var viewElevation = game.player.elevation;

		var objectDirection = object.direction; // don't alter the actual object
		var horizon = 90;

		// normalise relative angles on to the same 180 degrees - anticlockwise is always negative
		//if(viewDirection > 180 && objectDirection < 180) objectDirection += 360; // normalise angles
		//if(viewDirection < 180 && objectDirection > 180) viewDirection += 360; // normalise angles

		var objectDistance = object.distance;
		var fov = view.fov;

		var leftAngle = objectDirection - Math.deg(Math.atan((object.width/2)/objectDistance));
		var rightAngle = objectDirection + Math.deg(Math.atan((object.width/2)/objectDistance));

		var viewLeft = viewDirection - fov/2;

		var upperAngle = horizon + Math.deg(Math.atan((object.height-view.height)/objectDistance));
		var lowerAngle = horizon - Math.deg(Math.atan(view.height/objectDistance));

		var viewUpper = viewElevation + fov/2;
		
		var width = (rightAngle-leftAngle)/fov;
		var height = (upperAngle-lowerAngle)/fov;

		var horizontalAngle = (leftAngle - viewLeft);
		var verticalAngle = (viewUpper - upperAngle);

		if(horizontalAngle > 180) horizontalAngle -= 360;
		if(horizontalAngle < -180) horizontalAngle += 360;
		if(verticalAngle > 180) verticalAngle -= 360;
		if(verticalAngle < -180) verticalAngle += 360;

		var dx = horizontalAngle/fov;
		var dy = verticalAngle/fov;

		//debugger;

		return({
			dx: dx,
			dy: dy,
			width: width,
			height: height
		});
	};
/*
	// given a direction and an elevation, returns true/false if target is within bounds
	this.checkCollision = function(object,direction,elevation,hitRadius){

		var objectDirection = object.direction;

		// HORIZONTAL
		//if(direction > 180 && objectDirection < 180) objectDirection += 360; // normalise angles
		//if(direction < 180 && objectDirection > 180) direction += 360; // normalise angles
	
		var projObject = this.getProjection(object);

		// ASSUMES GROUND LEVEL!!!!
		var projTarget = this.getProjection({width:hitRadius,height:hitRadius,direction:direction,distance:object.distance});

		// Horizontal bounds
		if(projObject.dx+projObject.width < projTarget.dx) return false;
		if(projObject.dx > projTarget.dx+projTarget.width) return false;

		// Vertical bounds
		if(projObject.dy+projObject.height < projTarget.dy) return false;
		if(projObject.dy > projTarget.dy+projTarget.height) return false;

		console.log("Object",projObject);
		console.log("Hit",projTarget);

		return true;
	};
*/
	// given a direction and an elevation, returns true/false if target is within bounds
	this.checkCollision = function(object,direction,elevation,hitRadius){

		var objectDirection = object.direction;

		// HORIZONTAL
		//if(direction > 180 && objectDirection < 180) objectDirection += 360; // normalise angles
		//if(direction < 180 && objectDirection > 180) direction += 360; // normalise angles

		var horizontalBound = Math.abs(object.distance * Math.tan(Math.rad(object.direction - direction)));
		//var verticalBound = object.distance * Math.tan(Math.rad(90-elevation));
		var hitArea = object.distance * Math.tan(Math.rad(hitRadius));

		var horizontalTest = object.width/2 - horizontalBound;

		if(horizontalTest < 0 && Math.abs(horizontalTest)>hitArea/2) return false;

		// VERTICAL
		var angleToBase = Math.deg(Math.atan(object.distance/view.height));
		var angleToTop;

		var heightDiff = view.height - object.height;
		if(heightDiff > 0){

			angleToTop = Math.deg(Math.atan(object.distance/heightDiff));

		}else if(heightDiff === 0){

			angleToTop = 90;

		}else{

			heightDiff *= -1;
			angleToTop = 90 + Math.deg(Math.atan(object.distance/heightDiff));
		}

		if(elevation+hitRadius < angleToBase || elevation-hitRadius > angleToTop) return false;

		return true;
	};


}