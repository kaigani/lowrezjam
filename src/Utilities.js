//
// Utilities
//

// add radian & degrees conversion
Math.rad = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.deg = function(radians) {
  return radians * 180 / Math.PI;
};

// distance between posts
function distanceFrom(x1,y1,x2,y2){

  return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

// polar to cartesian - in degrees
function polarToCartesian(r,rotation){

  var p = {};
  p.x = r * Math.cos(Math.rad(rotation));
  p.y = r * Math.sin(Math.rad(rotation));

  return p;
}

// spherical to cartesian - in degrees
function sphericalToCartesian(r,rotation,elevation){

  var p = {};
  p.x = r * Math.sin(Math.rad(rotation));
  p.y = r * Math.sin(Math.rad(elevation));
  p.z = r * Math.cos(Math.rad(elevation)) * Math.sin(Math.rad(rotation));

  return p;
}


// Convert to & from vector
function vectorToPoint(v){
	return({x:v.e(1),y:v.e(2)});
}
// see
// http://gamedev.stackexchange.com/questions/45412/understanding-math-used-to-determine-if-vector-is-clockwise-counterclockwise-f

// uses vectors defined as {x:x,y:y} - use vectorObject()
function vectorSign(v1,v2){

	var clockwise = 1;
	var anticlockwise = -1;

	if(v1.y*v2.x > v1.x*v2.y){
		return anticlockwise;
	}else{
		return clockwise;
	}
}

// see
// http://stackoverflow.com/questions/21483999/using-atan2-to-find-angle-between-two-vectors

// angle = atan2(vector2.y, vector2.x) - atan2(vector1.y, vector1.x);

// normalize it to the range 0 .. 2 * Pi:
// if (angle < 0) angle += 2 * M_PI;

function angleBetween(v1,v2){

  var angle = Math.atan2(v2.y,v2.x) - Math.atan2(v1.y,v1.x);
  //if(angle < 0) angle += 2 * Math.PI;

  return( Math.deg(angle) );
}


// DRAW A PARAGRAPH
CanvasRenderingContext2D.prototype.fillParagraph = function(text,fontSize,font,x,y,width){
  this.font = fontSize+'px '+font;
  var words = text.split(' ');
  var lines = [];
  var i;
  lines.push(words.shift());
  while(words.length > 0){
    var word = words.shift();
    i = lines.length-1;
    var newline = lines[i]+' '+word;
    if(this.measureText(newline).width < width){
      lines[i] = newline;
    }else{
      lines.push(word);
    }
  }

  var leading = 1.2*fontSize;

  for(i=0;i<lines.length;i++){
    this.fillText(lines[i], x, y+leading*i);
  }

  return(leading*i); // height

};

// getJSON
var getJSON = function(url, successHandler, errorHandler) {
  var xhr = typeof XMLHttpRequest != 'undefined'
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('get', url, true);
  xhr.onreadystatechange = function() {
    var status;
    var data;
    // http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
    if (xhr.readyState == 4) { // `DONE`
      status = xhr.status;
      if (status == 200) {
        //data = JSON.parse(xhr.responseText);
        data = xhr.responseText;
        successHandler && successHandler(data);
      } else {
        errorHandler && errorHandler(status);
      }
    }
  };
  xhr.send();
};


/* 
 * REPURPOSED FROM SPINEJS 
 *
 */

/** Returns true if the polygon contains the point. */
// polygon in the form [x1,y1,x2,y2,...]
polygonContainsPoint = function (polygon, x, y) {
  var nn = polygon.length;
  var prevIndex = nn - 2;
  var inside = false;
  for (var ii = 0; ii < nn; ii += 2) {
    var vertexY = polygon[ii + 1];
    var prevY = polygon[prevIndex + 1];
    if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y)) {
      var vertexX = polygon[ii];
      if (vertexX + (y - vertexY) / (prevY - vertexY) * (polygon[prevIndex] - vertexX) < x) inside = !inside;
    }
    prevIndex = ii;
  }
  return inside;
};

/** Returns true if the polygon contains the line segment. */
polygonIntersectsSegment = function (polygon, x1, y1, x2, y2) {
  var nn = polygon.length;
  var width12 = x1 - x2, height12 = y1 - y2;
  var det1 = x1 * y2 - y1 * x2;
  var x3 = polygon[nn - 2], y3 = polygon[nn - 1];
  for (var ii = 0; ii < nn; ii += 2) {
    var x4 = polygon[ii], y4 = polygon[ii + 1];
    var det2 = x3 * y4 - y3 * x4;
    var width34 = x3 - x4, height34 = y3 - y4;
    var det3 = width12 * height34 - height12 * width34;
    var x = (det1 * width34 - width12 * det2) / det3;
    if (((x >= x3 && x <= x4) || (x >= x4 && x <= x3)) && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))) {
      var y = (det1 * height34 - height12 * det2) / det3;
      if (((y >= y3 && y <= y4) || (y >= y4 && y <= y3)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))) return true;
    }
    x3 = x4;
    y3 = y4;
  }
  return false;
};

// shim layer with setTimeout fallback - doesn't seem to outperform setInterval though...
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
