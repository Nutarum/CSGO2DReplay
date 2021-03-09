var shots = [];
var smokes = [];
var heExplosions = [];
var flashExplosions = [];

function deleteAllObjects(){
	shots = [];
	smokes = [];
	heExplosions = [];
	flashExplosions = [];
}

function passTime(){
	removeShots();
	removeSmokes();
	removeHeExplosions();
	removeFlashExplosions();
}

function removeShots(){
	shots.forEach(shot => {
		shot[3] --;
		if(shot[3]<=0){
			shots.splice(shots.indexOf(shot),1)
		}		
	});
}

function removeSmokes(){
	smokes.forEach(smoke => {
		smoke[2] --;
		if(smoke[2]<=0){
			smokes.splice(smokes.indexOf(smoke),1)
		}		
	});
}

function removeHeExplosions(){
	heExplosions.forEach(he => {
		he[2] --;
		if(he[2]<=0){
			heExplosions.splice(heExplosions.indexOf(he),1)
		}		
	});
}

function removeFlashExplosions(){
	flashExplosions.forEach(flash => {
		flash[2] --;
		if(flash[2]<=0){
			flashExplosions.splice(flashExplosions.indexOf(flash),1)
		}		
	});
}

