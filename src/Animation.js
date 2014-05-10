(function(window){

window.Animation = function(loader){

	var animation = this;
	this.loaded = false;

	var assetPath = 'assets/img/'; //game.settings.assetPath; 

	var assetList = [];
	for(var key in AnimationAssets){

		assetData = AnimationAssets[key];
		var fileString = assetPath+assetData.src;

		if(assetList.indexOf(fileString) === -1) assetList.push(fileString);
	}

	console.log("Asset list:",assetList);

	loader.addFiles(assetList);
	loader.on('finish',function(){
		console.log('Animation assets loaded.');
		animation.loaded = true;
	});

	this.getFrame = function(animationName,time){

		time = time || 0;

		var data = AnimationData[animationName];

		if(!data){
			console.warn('No animation named:',animationName);
			return null;
		}

		if(data.loop){
			time %= data.duration;
		}else if(time > data.duration){
			return null; // end of animation
		}

		var frame = data.frames[0].frame;
		for(var i=0;i<data.frames.length;i++){

			if(time < data.frames[i].time){
				break;
			}else{
				frame = data.frames[i].frame;
			}
		}

		//return loader.getFile(frame);
		var assetData = AnimationAssets[frame];
		var asset = loader.getFile(assetPath+assetData.src);

		return ({ asset:asset, sx:assetData.sx, sy:assetData.sy, sw:assetData.sw, sh:assetData.sh });
	};

	// slight hack by putting this in the animation class
	this.getSprite = function(spriteName){

		var assetData = AnimationAssets[spriteName];
		if(!assetData) return null;

		var asset = loader.getFile(assetPath+assetData.src);
		if(!asset) return null;

		return ({ asset:asset, sx:assetData.sx, sy:assetData.sy, sw:assetData.sw, sh:assetData.sh });

	};
};

var AnimationData = {

	'enemy_WALK' : {

		loop : true ,
		duration : 1.5 ,

		frames : [
			{ time : 0 , frame : 'enemy_WALK-01' } ,
			{ time : 0.5 , frame : 'enemy_WALK-02' } ,
			{ time : 1 , frame : 'enemy_WALK-03' }
		]
	},

	'enemy_ATTACK' : {

		loop : true ,
		duration : 1.5 ,

		frames : [
			{ time : 0 , frame : 'enemy_WALK-01' } ,
			{ time : 0.5 , frame : 'enemy_WALK-02' } ,
			{ time : 1 , frame : 'enemy_WALK-03' }
		]
	},

	'enemy_DEATH' : {

		loop : false ,
		duration : 1 ,

		frames : [
			{ time : 0.0 , frame : 'enemy_DEATH-01' } ,
			{ time : 0.1 , frame : 'enemy_DEATH-02' } ,
			{ time : 0.2 , frame : 'enemy_DEATH-03' } ,
			{ time : 0.3 , frame : 'enemy_DEATH-04' } ,
			{ time : 0.4 , frame : 'enemy_DEATH-05' }
		]
	},

	'gui_DEFAULT' : {

		loop : true ,
		duration : 1 ,

		frames : [
			{ time : 0.0 , frame : 'gui_DEFAULT' }
		]
	},

	'gui_SHOOT' : {

		loop : false ,
		duration : 0.1 ,

		frames : [
			{ time : 0.0 , frame : 'gui_SHOOT' }
		]
	}
};

// As Atlases

var AnimationAssets = {

	"titleCard" : { "src":"titleCard.png", "sx":0, "sy":0, "sw":32, "sh":32 } ,

	"enemy_DEATH-01" : { "src":"zombieAtlas.png", "sx":68, "sy":1080, "sw":17, "sh":30 } ,
	"enemy_DEATH-02" : { "src":"zombieAtlas.png", "sx":51, "sy":1080, "sw":17, "sh":30 } ,
	"enemy_DEATH-03" : { "src":"zombieAtlas.png", "sx":34, "sy":1080, "sw":17, "sh":30 } ,
	"enemy_DEATH-04" : { "src":"zombieAtlas.png", "sx":17, "sy":1080, "sw":17, "sh":30 } ,
	"enemy_DEATH-05" : { "src":"zombieAtlas.png", "sx":0, "sy":1080, "sw":17, "sh":30 } ,

	"enemy_WALK-01" : { "src":"zombieAtlas.png", "sx":200, "sy":540, "sw":200, "sh":540 } ,
	"enemy_WALK-02" : { "src":"zombieAtlas.png", "sx":0, "sy":540, "sw":200, "sh":540 } ,
	"enemy_WALK-03" : { "src":"zombieAtlas.png", "sx":200, "sy":0, "sw":200, "sh":540 } ,
	"enemy_WALK-04" : { "src":"zombieAtlas.png", "sx":0, "sy":0, "sw":200, "sh":540 } ,

	"obstacle_FACE" : { "src":"hires.jpg", "sx":0, "sy":0, "sw":300, "sh":300 } ,

	"gui_DEFAULT"	: { "src":"gui_DEFAULT.png", "sx":0, "sy":0, "sw":32, "sh":32 } ,
	"gui_SHOOT"		: { "src":"gui_SHOOT.png", "sx":0, "sy":0, "sw":32, "sh":32 } ,
	"gui_ZOOM"		: { "src":"gui_ZOOM.png", "sx":0, "sy":0, "sw":32, "sh":32 } ,

	// Small font courtesy of Pixel Art Magazine @PixelArtM
	"pixelArtM_A"	: { "src":"pixelartm_font.png", "sx":1, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_B"	: { "src":"pixelartm_font.png", "sx":5, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_C"	: { "src":"pixelartm_font.png", "sx":9, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_D"	: { "src":"pixelartm_font.png", "sx":13, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_E"	: { "src":"pixelartm_font.png", "sx":17, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_F"	: { "src":"pixelartm_font.png", "sx":21, "sy":1, "sw":2, "sh":5 } ,
	"pixelArtM_G"	: { "src":"pixelartm_font.png", "sx":25, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_H"	: { "src":"pixelartm_font.png", "sx":29, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_I"	: { "src":"pixelartm_font.png", "sx":34, "sy":1, "sw":1, "sh":5 } ,
	"pixelArtM_J"	: { "src":"pixelartm_font.png", "sx":37, "sy":1, "sw":2, "sh":5 } ,
	"pixelArtM_K"	: { "src":"pixelartm_font.png", "sx":41, "sy":1, "sw":3, "sh":5 } ,
	"pixelArtM_L"	: { "src":"pixelartm_font.png", "sx":46, "sy":1, "sw":1, "sh":5 } ,
	"pixelArtM_M"	: { "src":"pixelartm_font.png", "sx":49, "sy":1, "sw":3, "sh":5 } ,

	"pixelArtM_N"	: { "src":"pixelartm_font.png", "sx":1, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_O"	: { "src":"pixelartm_font.png", "sx":5, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_P"	: { "src":"pixelartm_font.png", "sx":9, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_Q"	: { "src":"pixelartm_font.png", "sx":13, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_R"	: { "src":"pixelartm_font.png", "sx":18, "sy":7, "sw":2, "sh":5 } ,
	"pixelArtM_S"	: { "src":"pixelartm_font.png", "sx":21, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_T"	: { "src":"pixelartm_font.png", "sx":25, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_U"	: { "src":"pixelartm_font.png", "sx":29, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_V"	: { "src":"pixelartm_font.png", "sx":33, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_W"	: { "src":"pixelartm_font.png", "sx":37, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_X"	: { "src":"pixelartm_font.png", "sx":41, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_Y"	: { "src":"pixelartm_font.png", "sx":45, "sy":7, "sw":3, "sh":5 } ,
	"pixelArtM_Z"	: { "src":"pixelartm_font.png", "sx":49, "sy":7, "sw":3, "sh":5 } ,

	"pixelArtM_0"	: { "src":"pixelartm_font.png", "sx":1, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_1"	: { "src":"pixelartm_font.png", "sx":6, "sy":13, "sw":1, "sh":5 } ,
	"pixelArtM_2"	: { "src":"pixelartm_font.png", "sx":9, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_3"	: { "src":"pixelartm_font.png", "sx":13, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_4"	: { "src":"pixelartm_font.png", "sx":17, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_5"	: { "src":"pixelartm_font.png", "sx":21, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_6"	: { "src":"pixelartm_font.png", "sx":25, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_7"	: { "src":"pixelartm_font.png", "sx":29, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_8"	: { "src":"pixelartm_font.png", "sx":33, "sy":13, "sw":3, "sh":5 } ,
	"pixelArtM_9"	: { "src":"pixelartm_font.png", "sx":37, "sy":13, "sw":3, "sh":5 } ,

	// big font
	"bannerFont_A"	: {"src":"banner_font.png", "sx":0, "sy":0, "sw":10, "sh":32 } ,
	"bannerFont_B"	: {"src":"banner_font.png", "sx":12, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_C"	: {"src":"banner_font.png", "sx":23, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_D"	: {"src":"banner_font.png", "sx":34, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_E"	: {"src":"banner_font.png", "sx":45, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_F"	: {"src":"banner_font.png", "sx":56, "sy":0, "sw":8, "sh":32 } ,
	"bannerFont_G"	: {"src":"banner_font.png", "sx":66, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_H"	: {"src":"banner_font.png", "sx":77, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_I"	: {"src":"banner_font.png", "sx":88, "sy":0, "sw":3, "sh":32 } ,
	"bannerFont_J"	: {"src":"banner_font.png", "sx":91, "sy":0, "sw":6, "sh":32 } ,
	"bannerFont_K"	: {"src":"banner_font.png", "sx":99, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_L"	: {"src":"banner_font.png", "sx":111, "sy":0, "sw":3, "sh":32 } ,
	"bannerFont_M"	: {"src":"banner_font.png", "sx":116, "sy":0, "sw":16, "sh":32 } ,
	"bannerFont_N"	: {"src":"banner_font.png", "sx":134, "sy":0, "sw":10, "sh":32 } ,
	"bannerFont_O"	: {"src":"banner_font.png", "sx":146, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_P"	: {"src":"banner_font.png", "sx":157, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_Q"	: {"src":"banner_font.png", "sx":168, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_R"	: {"src":"banner_font.png", "sx":179, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_S"	: {"src":"banner_font.png", "sx":190, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_T"	: {"src":"banner_font.png", "sx":201, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_U"	: {"src":"banner_font.png", "sx":211, "sy":0, "sw":10, "sh":32 } ,
	"bannerFont_V"	: {"src":"banner_font.png", "sx":223, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_W"	: {"src":"banner_font.png", "sx":234, "sy":0, "sw":15, "sh":32 } ,
	"bannerFont_X"	: {"src":"banner_font.png", "sx":252, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_Y"	: {"src":"banner_font.png", "sx":263, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_Z"	: {"src":"banner_font.png", "sx":274, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_0"	: {"src":"banner_font.png", "sx":290, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_1"	: {"src":"banner_font.png", "sx":301, "sy":0, "sw":3, "sh":32 } ,
	"bannerFont_2"	: {"src":"banner_font.png", "sx":306, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_3"	: {"src":"banner_font.png", "sx":318, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_4"	: {"src":"banner_font.png", "sx":329, "sy":0, "sw":10, "sh":32 } ,
	"bannerFont_5"	: {"src":"banner_font.png", "sx":340, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_6"	: {"src":"banner_font.png", "sx":352, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_7"	: {"src":"banner_font.png", "sx":362, "sy":0, "sw":10, "sh":32 } ,
	"bannerFont_8"	: {"src":"banner_font.png", "sx":374, "sy":0, "sw":9, "sh":32 } ,
	"bannerFont_9"	: {"src":"banner_font.png", "sx":385, "sy":0, "sw":9, "sh":32 }

};



})(window);