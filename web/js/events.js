roundTimeLoaded = false

function roundStart(){
	gettick((t)=>{lastRoundStart=t});
	
	if(roundStarts.length == 0 || roundStarts[roundStarts.length-1]<lastRoundStart){
		roundStarts.push(lastRoundStart);
		
		
		document.getElementById("roundBtns").innerHTML += "<button onclick='goToRound("+roundStarts.length+")'>"+roundStarts.length+"</button> "
	}
	if(nextround){		
		nextround = false;
		if(lastRoundStart > targetTick){
			targetTick = lastRoundStart + 14000 / tickInterval;
		}
	}	
	
	deleteAllObjects();
	
	if(!roundTimeLoaded){
		getroundtime((t)=>{			
			roundTime=60*t*1000;
		});		
		getfreezetime((t)=>{
			freezeTime=t*1000;
		});
	}
	
	freezeEndTime = 0;
	bombPlantedTime=0;
}

function bombPlanted(){
	console.log("!!!")
	gettick((t)=>{bombPlantedTime=t});
}


function roundFreezeEnd(){
	gettick((t)=>{freezeEndTime=t});
}

function fireEvent(e){
	var [x,y] = transformPositionInferno(e[0],e[1]);	
	shots.push([x,y,e[2],2]);
}

function smokeStart(e){
	var [x,y] = transformPositionInferno(e[0],e[1]);	
	smokes.push([x,y,585, e[2]]);
}

function heExplode(e){
	var [x,y] = transformPositionInferno(e[0],e[1]);	
	heExplosions.push([x,y,200, e[2]]);
}

function flashExplode(e){
	var [x,y] = transformPositionInferno(e[0],e[1]);	
	flashExplosions.push([x,y,10, e[2]]);
}