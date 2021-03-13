var mapname = ""
var weaponList = []

function testpos(x,y){
	[nx,ny] = transformPosition(x,y);
	ctx.beginPath();
	ctx.fillStyle = "#ff0000";
	ctx.arc(nx, ny, 2, 0, 2 * Math.PI);
	ctx.fill();
}

function changeRadar(e){
	if(document.getElementById("simpleRadar").checked){
		background.src = "./resources/"+mapname+"_simple.png";
	}else{
		background.src = "./resources/"+mapname+".png";
	}
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
	return [(x+initialX)/finalScale + mapOffsetX,  - ((y-initialY)/finalScale)];		
}

function ordenaPlayers(a, b) {
  if (a["userid"]<b["userid"]) {
    return -1;
  }
  return 1;
}

function loadWeaponList(){
	weaponList[0]="Unknown";
	// Pistols
	weaponList[1]="P2000";
	weaponList[2]="Glock";
	weaponList[3]="P250";
	weaponList[4]="Deagle";
	weaponList[5]="5Seven";
	weaponList[6]="berettas";
	weaponList[7]="Tec9";
	weaponList[8]="CZ";
	weaponList[9]="USP";
	weaponList[10]="Revolver";
	// SMGs
	weaponList[101]="MP7";
	weaponList[102]="MP9";
	weaponList[103]="Bizon";
	weaponList[104]="Mac10";
	weaponList[105]="UMP";
	weaponList[106]="P90";
	weaponList[107]="MP5";
	// Heavy
	weaponList[201]="SawedOff";
	weaponList[202]="Nova";
	weaponList[203]="Mag7";
	weaponList[204]="XM1014";
	weaponList[205]="M249";
	weaponList[206]="Negev";
	// Rifles
	weaponList[301]="Galil";
	weaponList[302]="Famas";
	weaponList[303]="AK47";
	weaponList[304]="M4A4";
	weaponList[305]="M4A1";
	weaponList[306]="Scout";
	weaponList[307]="SG";
	weaponList[308]="AUG";
	weaponList[309]="AWP";
	weaponList[310]="AutoNoob";
	weaponList[311]="AutoNoob";
	// Equipment
	weaponList[401]="Zeus";
	weaponList[402]="Kevlar";
	weaponList[403]="Helmet";
	weaponList[404]="Bomb";
	weaponList[405]="Knife";
	weaponList[406]="Defuse";
	weaponList[407]="World";
	// Grenades
	weaponList[501]="Decoy";
	weaponList[502]="Molo";
	weaponList[503]="Molo";
	weaponList[504]="Flash";
	weaponList[505]="Smoke";
	weaponList[506]="HE";
}
