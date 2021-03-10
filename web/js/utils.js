var mapname = ""

function testpos(x,y){
	[nx,ny] = transformPosition(x,y);
	ctx.beginPath();
	ctx.fillStyle = "#ff0000";
	ctx.arc(nx, ny, 2, 0, 2 * Math.PI);
	ctx.fill();
}

function downloadTest(){	
	var file_path = "resources/demo.dem";
	var a = document.createElement('A');
	a.href = file_path;
	a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);	
}

var initialX = 2000;
var initialY = 3800;
var finalScale = 5;

function prepararPosiciones(){
	var imageSize=1024;
	
	var scale = 5;
	
	if(mapname=="de_inferno"){
		scale = 4.9;
		initialX=2087;
		initialY=3870;		
	}if(mapname=="de_mirage"){
		scale = 5;
		initialX=3230;
		initialY=1713;		
	}if(mapname=="de_cache"){
		scale = 5.5;
		initialX=2000;
		initialY=3250;		
	}if(mapname=="de_overpass"){
		scale = 5.2;
		initialX=4831;
		initialY=1781;		
	}if(mapname=="de_dust2"){
		scale = 4.4;
		initialX=2470;
		initialY=3230;		
	}if(mapname=="de_nuke"){
		scale = 7;
		initialX=3453;
		initialY=2887;
	}if(mapname=="de_train"){
		scale = 4.7;
		initialX=2477;
		initialY=2392;	
	}if(mapname=="de_vertigo"){ 
		scale = 3.99;
		initialX=3170;
		initialY=1760;	
	}
	scaleTransform = imageSize/mapSize;
	finalScale = scale*scaleTransform;
}

function transformPosition(x,y){			
	return [(x+initialX)/finalScale,  - ((y-initialY)/finalScale)];		
}

function comparaNombres(a, b) {
  if (a["name"]<b["name"]) {
    return -1;
  }
  return 1;
}
