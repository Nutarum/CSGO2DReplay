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
	var t = new Date().getTime();
	removeShots(t);
	removeHeExplosions(t);
	removeFlashExplosions(t);
}

function removeShots(t){
	shots.forEach(shot => {
		if(t > shot[3]+50){
			shots.splice(shots.indexOf(shot),1)
		}		
	});
}

function removeHeExplosions(t){
	heExplosions.forEach(he => {
		if(t > he[2]+10000){
			heExplosions.splice(heExplosions.indexOf(he),1)
		}		
	});
}

function removeFlashExplosions(t){
	flashExplosions.forEach(flash => {		
		if(t > flash[2]+500){
			flashExplosions.splice(flashExplosions.indexOf(flash),1)
		}		
	});
}

