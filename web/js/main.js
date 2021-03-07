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

var tickInterval = 15.625;
var speedModifier = 1;

function parseFile() {
	console.log('reading demo');
	state("reading demo");

	const reader = new FileReader();
	reader.onload = function () {
		const data = reader.result;
		const bytes = new Uint8Array(data);
		console.log('parsing');
		state("parsing");
		
		parseinit(bytes, (dataJSON) => {
			var data = JSON.parse(dataJSON);			
			console.log(data);
			tickInterval = 1/data[1]*1000;
		});		
		
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

var lastRoundStart = 0;
var roundCurrentTime = 0;
function roundStart(){
	gettick((t)=>{lastRoundStart=t});
	roundCurrentTime = new Date().getTime();
	if(nextround){
		nextround = false;
	}	
}

var nextround = false;
function nextRound(){
	nextround = true;
	play();
}	

function comparaNombres(a, b) {
  if (a["name"]<b["name"]) {
    return -1;
  }
  return 1;
}

function draw(gameJson){
	ctx.clearRect(0,0,800,800);
	ctx.drawImage(background,0,0,800,800);   	
		
	var game = JSON.parse(gameJson);
	
	if(game[1]){
		game[1].forEach(nade => {		
			var [posX,posY] = transformPositionInferno(nade["x"],nade["y"]);					
			if(nade["type"]==501){ //decoy
				ctx.fillStyle = "#f81898";
			}else if(nade["type"]==502 || nade["type"]==503){ //molo
				ctx.fillStyle = "#ff0000";
			}else if(nade["type"]==504){ //flash
				ctx.fillStyle = "#ffffff";
			}else if(nade["type"]==505){ //smoke
				ctx.fillStyle = "#8888ff";
			}else if(nade["type"]==506){ //he
				ctx.fillStyle = "#ffa500";
			}				
			ctx.beginPath();
			ctx.rect(posX, posY, 5, 10);
			ctx.fill();
		});
	}
	
	game[0].sort(comparaNombres);
	game[0].forEach(player => {		
	
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
			
			//reloading
			if(player["rel"]){
				ctx.beginPath();			
				ctx.arc(posX+7, posY-7, 3, 0, 2 * Math.PI);				
				ctx.fillStyle = "#ffffff";
				ctx.fill();
			}
			
			//bomb interaction
			if(player["bombInt"]){
				ctx.beginPath();			
				ctx.arc(posX+7, posY-7, 3, 0, 2 * Math.PI);				
				ctx.fillStyle = "#ff3333";
				ctx.fill();
			}
			
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
	
	
	if(game[2]){
		game[2].forEach(inferno => {	
			ctx.strokeStyle = "#ff0000";			
			ctx.beginPath();
			
			var [x,y] = transformPositionInferno(inferno[0].X,inferno[0].Y);
			
			ctx.moveTo(x, y);
			inferno.forEach(pos => {
				var [x,y] = transformPositionInferno(pos.X,pos.Y);	
				ctx.lineTo(x, y);
			});
			ctx.closePath();				
			ctx.stroke();
			ctx.globalAlpha = 0.2;
			ctx.fillStyle = "#ff0000";		
			ctx.fill();		
			ctx.globalAlpha = 1;			
		});
	}
		
	shots.forEach(shot => {
		ctx.beginPath();
		ctx.strokeStyle="#dddddd";		
		rads = shot[2] * (Math.PI/180);		
		ctx.moveTo(shot[0] + 7 * Math.cos(rads),shot[1] - 7 * Math.sin(rads));
		ctx.lineTo(shot[0] + 100 * Math.cos(rads),shot[1] - 100 * Math.sin(rads));
		ctx.stroke();			
	});
	

	ctx.font = "14px Arial";
	ctx.fillStyle = "#ffdd00"
	ctx.textAlign = "right";
	var teamName = game[3][1];
	if(!teamName){
		teamName = "Terrorists";
	}
	ctx.fillText(teamName + " - " + game[3][2], 395, 20);
		
	teamName = game[3][3];
	if(!teamName){
		teamName = "Counterterrorists";
	}
	ctx.fillStyle = "#00bbff"
	ctx.textAlign = "left";
	ctx.fillText(game[3][4] + " - " + teamName, 405, 20);
	
	ctx.fillStyle = "#ffffff"
	ctx.textAlign = "center";
	ctx.fillText("round " + (parseInt(game[3][0])+1), 400, 40);

	
	var tick;
	gettick((t)=>{tick = t});
	var txtTime =  ((tick - lastRoundStart) * tickInterval) / 1000;
	
	ctx.font = "14px Arial";
	ctx.fillStyle = "#bbbbbb";
	ctx.textAlign = "left";
	ctx.fillText(txtTime, 375, 60);
		
}

function skip5(){
	var thisTick;
	gettick((t)=>{thisTick = t});
	targetTick = thisTick + 5000/tickInterval;
}

function back5(){
	var thisTick;
	gettick((t)=>{thisTick = t});
	targetTick = thisTick - 5000/tickInterval;
	
	parseFile();		
}

targetTick = 0;
function processNextTick(){	
	while(nextround){
		removeShots();
		parsetick((e) =>{});
	}
	
	var thisTick;
	gettick((t)=>{thisTick = t});
	while(thisTick<targetTick){	
		parsetick((e) =>{});
		gettick((t)=>{thisTick = t});
		nextTick = new Date().getTime()+tickInterval * speedModifier;
		removeShots();
	}
	
	if(new Date().getTime()>=nextTick){		
		removeShots();	
		
		var oldTick 		
		gettick((t)=>{oldTick = t});
		
		parsetick((e) =>{});
		
		gettick((t)=>{newTick = t});
		
		
		while(newTick>oldTick){
			nextTick += tickInterval / speedModifier;
			newTick--;
		}	
		
		getgameinfo((game) =>{
			draw(game)			
		});	
	}	
}

var playInterval;
function play(){	
	if(!playInterval){
		nextTick = new Date().getTime()+tickInterval * speedModifier;
		playInterval=setInterval(processNextTick,2);	
	}		
}

function stop(){
	clearInterval(playInterval);
	playInterval = null;
}

function state(state) {
	document.getElementById('state').innerText = state;
}