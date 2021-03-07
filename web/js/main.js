var ctx;
var background = new Image();
window.onload = function() {
    var myCanvas = document.getElementById('canvas');
    ctx = myCanvas.getContext('2d');
	
	
	background.src = "./resources/de_inferno.png";
	// Make sure the image is loaded first otherwise nothing will draw.
	background.onload = function(){
		ctx.drawImage(background,0,0,800,800);   
	}
	
};

document.addEventListener('DOMContentLoaded', function () {
	state('init');

	const go = new Go();
	WebAssembly.instantiateStreaming(fetch("./wasm/demoinfocs.wasm"), go.importObject).then((result) => {
		go.run(result.instance);
		state('ready')
	});
	
}, false);

var shots = [];
function fireEvent(e){	
	var [x,y] = transformPositionInferno(e[0],e[1]);	
	shots.push([x,y,e[2],2]);
}

function parseFile() {
	console.log('reading demo');
	state("reading demo");

	const reader = new FileReader();
	reader.onload = function () {
		const data = reader.result;
		const bytes = new Uint8Array(data);
		console.log('parsing');
		state("parsing");
		parseinit(bytes, (mapname) => console.log(mapname), fireEvent);
	};
	reader.readAsArrayBuffer(document.getElementById('demofile').files[0])
}

function transformPositionInferno(x,y){
	return [x/6.208 + 332, 800 - (y/6.208+176)];
}

function removeShots(){
	shots.forEach(shot => {
		shot[3] --;
		if(shot[3]<=0){
			shots.splice(shots.indexOf(shot),1)
		}		
	});
}

function parseTick() {
	removeShots();
	
	
	parsetick((e) =>{});
}

function parse1000() {
	for (var i = 0; i < 1000; i++) {
		parseTick();
	}	
}


function getTick() {
	gettick((t) =>console.log(t));
}

function draw(playersJson){
	ctx.clearRect(0,0,800,800);
	ctx.drawImage(background,0,0,800,800);   	
	
	var players = JSON.parse(playersJson);
	players.forEach(player => {		
	
		if(player["team"]==2){
			var teamColor = "#ffdd00"
		}else{
			var teamColor = "#00bbff"
		}				
		
		var [posX,posY] = transformPositionInferno(player["x"],player["y"]);
		
		//var posX = player["x"] / 6.208 + 332
		//var posY = 800-(player["y"] / 6.208 + 176)
		
		//if the player is alive
		if(player["health"]>0){		
			// circle at the players position outline
			ctx.beginPath();
			ctx.fillStyle = "#666666";
			ctx.arc(posX, posY, 7, 0, 2 * Math.PI);
			ctx.fill();
			
			// circle at the players position
			ctx.beginPath();
			ctx.fillStyle=teamColor;
			ctx.arc(posX, posY, 5, 0, 2 * Math.PI);
			ctx.fill();			
			
			//player health indicator
			if(player["health"]<100){
				ctx.beginPath();
				//ctx.globalAlpha = 0.5;
				ctx.fillStyle="#ff4444";			
				ctx.arc(posX, posY, 4, -1.5708, -1.5708 + ((100-player["health"])/100)*(2 * Math.PI));
				ctx.lineTo(posX,posY);
				ctx.closePath();
				ctx.fill();	
				//ctx.globalAlpha =1;
			}
			
			
			
			// triangle pointing the player direction
			var rads = player["dir"] * (Math.PI/180);			
			var triangleX = posX + 8 * Math.cos(rads);
			var triangleY = posY - 8 * Math.sin(rads);			
			ctx.beginPath();			
			ctx.fillStyle = teamColor;
			ctx.moveTo(triangleX + 4 * Math.cos(rads+2*Math.PI/3) ,triangleY - 4 * Math.sin(rads+2*Math.PI/3));
			ctx.lineTo(triangleX + 3 * Math.cos(rads),triangleY - 3 * Math.sin(rads));
			ctx.lineTo(triangleX + 4 * Math.cos(rads+4*Math.PI/3) ,triangleY - 4 * Math.sin(rads+4*Math.PI/3));
			ctx.closePath();
			ctx.fill();
			
			//player name
			ctx.font = "8px Arial";
			ctx.fillStyle = "#bbbbbb";
			ctx.textAlign = "center";
			ctx.fillText(player["name"], posX, posY-12);
		}else{
			//if the player is dead, draw an X at the position
			ctx.strokeStyle = teamColor;			
			ctx.beginPath();
			ctx.moveTo(posX-4, posY-4);
			ctx.lineTo(posX+4, posY+4);
			ctx.stroke();
			ctx.moveTo(posX-4, posY+4);
			ctx.lineTo(posX+4, posY-4);
			ctx.stroke();
		}					
		
	});
	
	shots.forEach(shot => {
		ctx.beginPath();
		ctx.strokeStyle="#dddddd";		
		rads = shot[2] * (Math.PI/180);		
		ctx.moveTo(shot[0] + 7 * Math.cos(rads),shot[1] - 7 * Math.sin(rads));
		ctx.lineTo(shot[0] + 100 * Math.cos(rads),shot[1] - 100 * Math.sin(rads));
		ctx.stroke();			
	});
}

function processNextTick(){
	removeShots();
	
	parsetick((e) =>{		
		getPlayerInfo();
	});
}
var playInterval;
function play(){
	if(!playInterval){
		playInterval=setInterval(processNextTick,15.625);	
	}		
}

function stop(){
	clearInterval(playInterval);
	playInterval = null;
}

function getPlayerInfo() {
	getplayerinfo((players) =>{
		draw(players)		
	});
}

function state(state) {
	document.getElementById('state').innerText = state;
}