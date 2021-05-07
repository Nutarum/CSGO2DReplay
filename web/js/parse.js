function parseFile() {
	
	if(document.getElementById('demofile').files[0]["name"].split('.').pop() != "dem"){
		alert("Please, select a '.dem' file.");
		return;
	}
	
	const reader = new FileReader();
	reader.onload = function () {
		const data = reader.result;
		const bytes = new Uint8Array(data);
		
		parseinit(bytes, (dataJSON) => {
			var data = JSON.parse(dataJSON);			
			console.log(data);
			mapname = data[0];
			tickInterval = 1/data[1]*1000;
			
			prepararPosiciones();
						
			background.src = "./resources/"+mapname+".png";
			
            document.getElementById('selectDemoDiv').style.visibility = "hidden";

			var elems = document.getElementsByClassName('btnControl');
			for (var i = 0; i < elems.length; i ++) {
				elems[i].disabled = false;
			}
			nextRound();			
            
            document.getElementById('replayDiv').style.visibility = "visible";
		});		
		
	};
	reader.readAsArrayBuffer(document.getElementById('demofile').files[0])
}

function processNextTick(){
	while(nextround){
		passTime();			
		parsetick();
	}
	
	var thisTick;
	gettick((t)=>{thisTick = t});
	while(thisTick<targetTick){	
		passTime();	
		parsetick();		
		gettick((t)=>{thisTick = t});
		nextTick = new Date().getTime()+tickInterval * speedModifier;
	}
	
	if(new Date().getTime()>=nextTick){
		
		
		var oldTick 		
		gettick((t)=>{oldTick = t});
		
		parsetick();		
		
		gettick((t)=>{newTick = t});		
				
		while(newTick>oldTick){
			nextTick += tickInterval / speedModifier;				
			newTick--;
		}	
		
		passTime();		
		getgameinfo((game) =>{
			draw(game)			
		});	
	}	
}