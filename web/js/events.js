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
	gettick((t)=>{bombPlantedTime=t});
}


function roundFreezeEnd(){
	gettick((t)=>{freezeEndTime=t});
}

function fireEvent(e){
	var thisTick;
	gettick((t)=>{thisTick=t})
	
	var [x,y] = transformPosition(e[0],e[1]);	
	shots.push([x,y,e[2],new Date().getTime()]);
}

function smokeStart(e){	
	var [x,y] = transformPosition(e[0],e[1]);
	smokes.push([x,y,e[2]]);
}
function smokeExpired(e){
	smokes.forEach((s)=>{if(s[2]==e[0]){smokes.splice(smokes.indexOf(s),1)}});	
}

function heExplode(e){
	var thisTick;
	gettick((t)=>{thisTick=t})
	
	var [x,y] = transformPosition(e[0],e[1]);	
	heExplosions.push([x,y, new Date().getTime(), e[2]]);
}

function flashExplode(e){
	var thisTick;
	gettick((t)=>{thisTick=t})
	
	var [x,y] = transformPosition(e[0],e[1]);	
	flashExplosions.push([x,y,new Date().getTime(), e[2]]);
}