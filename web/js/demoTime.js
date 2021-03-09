var tickInterval = 15.625;
var speedModifier = 1;
var roundStarts = [];
var nextround = false;
var targetTick = 0;
var lastRoundStart = 0;

var playInterval;
function play(){
	speedModifier = 1;
	if(!playInterval){
		nextTick = new Date().getTime()+tickInterval * speedModifier;
		playInterval=setInterval(processNextTick,2);	
	}		
}

function stop(){
	clearInterval(playInterval);
	playInterval = null;
}

function nextRound(){
	nextround = true;
	play();
}	

function skip10(){
	var thisTick;
	gettick((t)=>{thisTick = t});
	targetTick = thisTick + 10000/tickInterval;
}

function back10(){
	var thisTick;
	gettick((t)=>{thisTick = t});
	targetTick = thisTick - 10000/tickInterval;
	
	parseFile();		
}

function x2(){
	play();
	speedModifier=2;
}
function x4(){
	play();
	speedModifier=4;
}
function x0dot5(){
	play();
	speedModifier=0.5;
}

function goToRound(r){
	var thisTick;
	gettick((t)=>{thisTick = t});
	targetTick = roundStarts[r-1] + 14000/tickInterval;	
	
	if(targetTick<thisTick){
		parseFile();	
	}
	
}	