function loadCanvas(){
	var myCanvas = document.getElementById('canvas');
	
	myCanvas.width = mapSize+mapOffsetX+mapOffsetX;
	myCanvas.height = mapSize;
	
    ctx = myCanvas.getContext('2d');
	
    /*
	background.src = "./resources/de_inferno.png";
	
	// Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function(){
		ctx.drawImage(background,mapOffsetX,0,mapSize,mapSize);   
	}	
    */
}

function draw(gameJson){	
	ctx.clearRect(0,0,mapSize+mapOffsetX+mapOffsetX,mapSize);	
	
	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.rect(0,0,mapSize+mapOffsetX+mapOffsetX,mapSize);
	ctx.fill();
	
	try{
		ctx.drawImage(background,mapOffsetX,0,mapSize,mapSize);  
	}catch(e){
	}
	 	
		
	var game = JSON.parse(gameJson);
	
	if(game[1]){
		game[1].forEach(nade => {		
			var [posX,posY] = transformPosition(nade["x"],nade["y"]);		

			drawNade = true;
			
			if(nade["type"]==501){ //decoy
				ctx.fillStyle = "#f81898";
			}else if(nade["type"]==502 || nade["type"]==503){ //molo
				ctx.fillStyle = "#ff0000";
			}else if(nade["type"]==504){ //flash
				ctx.fillStyle = "#ffffff";
			}else if(nade["type"]==505){ //smoke
				ctx.fillStyle = "#8888ff";
				
				smokes.forEach(smoke => {
					if(nade["id"] == smoke[2]){
						drawNade=false;
					}
				});
				
			}else if(nade["type"]==506){ //he
				ctx.fillStyle = "#ffa500";
				
				heExplosions.forEach(he => {
					if(nade["id"] == he[3]){
						drawNade=false;
					}
				});
				
			}		
			
			if(drawNade){				
				ctx.beginPath();
				ctx.rect(posX-2, posY-4, 4, 8);
				ctx.fill();
			}
		});
	}	
	
	var tOffset = 0;
	var ctOffset = 0;
	var xOffset = 0;
	var yOffset = 0;
	
	game[0].sort(ordenaPlayers);
	game[0].forEach(player => {
		
		if(player["name"].length>20){
			player["name"] = player["name"].substring(0, 20);
		}
		
		ctx.font = "bold 12px Arial";
		ctx.fillStyle = "#dddddd"
			
		if(player["team"]==2){
			var teamColor = "#ffdd00"			
			
			xOffset = 20;
			yOffset =  (mapSize/2)-150 + tOffset*90;
							
			tOffset++;
		}else{
			var teamColor = "#00bbff"
						
			xOffset = mapSize + mapOffsetX + 20;
			yOffset =  (mapSize/2)-150 + ctOffset*90;
			
			ctOffset++;			
		}		
		
		ctx.beginPath();
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = teamColor;
		ctx.rect(xOffset, yOffset, 160, 40);			
		ctx.fill();
		ctx.globalAlpha =1;
			
		ctx.beginPath();
		ctx.fillStyle = teamColor;
		ctx.rect(xOffset, yOffset, player["health"]*1.6, 40);
		ctx.fill();
			
		ctx.beginPath();
		ctx.strokeStyle = "#888888";
		ctx.lineWidth = 3;
		ctx.rect(xOffset, yOffset, 160, 40);
		ctx.stroke();
		ctx.lineWidth = 1;
			
		ctx.textAlign = "center";
		ctx.fillStyle = "#000000";
		
		ctx.fillText(player["name"],xOffset+80, yOffset+17);
		
		ctx.fillText(player["k"]+"/"+player["a"]+"/"+player["d"],xOffset+80, yOffset+33);
		
		ctx.textAlign = "left";
		if(player["armor"]>0){
			if(player["helmet"]){
				ctx.fillText("H"+player["armor"],xOffset+5, yOffset+33);
			}else{				
				ctx.fillText("A"+player["armor"],xOffset+5, yOffset+33);
			}			
		}
		ctx.textAlign = "right";
		ctx.fillText("$"+player["money"],xOffset+155, yOffset+33);
		
		
		if(player["inv"]){
			player["inv"].sort();
			weaps = "";
			ctx.fillStyle = "#ffffff";
			
			if(player["defuse"]){
				ctx.textAlign = "right";
				ctx.fillText(weaponList[406],xOffset+155, yOffset+70);
			}
			
			var nNades = 0;
			player["inv"].forEach(w => {	
				if(w>10 && w <400){// arma principal
					ctx.textAlign = "left";
					ctx.fillText(weaponList[w],xOffset+5, yOffset+55);
				}else if(w>0 && w<11){ //pistola
					ctx.textAlign = "left";
					ctx.fillText(weaponList[w],xOffset+5, yOffset+70);
				}else if(w==401){//zeus
					ctx.textAlign = "center";
					ctx.fillText(weaponList[w],xOffset+80, yOffset+70);
				}else if(w==404){//bomb
					ctx.textAlign = "right";
					ctx.fillText(weaponList[w],xOffset+155, yOffset+70);
				}else if(w==406){//defuse
					//parece que el defuse no viene en el inventario, tiene una funcion a parte
					//ctx.textAlign = "right";
					//ctx.fillText(weaponList[w],xOffset+155, yOffset+70);
				}else if(w==501){ //decoy
					nNades++;
					ctx.fillStyle = "#f81898";
					ctx.beginPath();
					ctx.rect(xOffset+158-nNades*9, yOffset+47, 4, 8);
					ctx.fill();
				}else if(w==502 || w == 503){ //molo
					nNades++;
					ctx.fillStyle = "#ff0000";
					ctx.beginPath();
					ctx.rect(xOffset+158-nNades*9, yOffset+47, 4, 8);
					ctx.fill();
				}else if(w==504){ //flash
					nNades++;
					ctx.fillStyle = "#ffffff";
					ctx.beginPath();
					ctx.rect(xOffset+158-nNades*9, yOffset+47, 4, 8);
					ctx.fill();
				}else if(w==505){ //smoke
					nNades++;
					ctx.fillStyle = "#8888ff";
					ctx.beginPath();
					ctx.rect(xOffset+158-nNades*9, yOffset+47, 4, 8);
					ctx.fill();
				}else if(w==506){ //he
					nNades++;
					ctx.fillStyle = "#ffa500";
					ctx.beginPath();
					ctx.rect(xOffset+158-nNades*9, yOffset+47, 4, 8);
					ctx.fill();
				}		
			});
		}				
		
		var [posX,posY] = transformPosition(player["x"],player["y"]);
		
		//if the player is alive
		if(player["health"]>0){
					
			// circle at the players position outline
			ctx.beginPath();
			ctx.fillStyle = "#666666";
			ctx.arc(posX, posY, 7, 0, 2 * Math.PI);
			ctx.fill();
			
			//player flashed indicator
			if(player["flash"]>0){
				ctx.beginPath();
				ctx.fillStyle="#ffffff";		
				if(player["flash"]>=3000){					
					ctx.arc(posX, posY, 7, 0,2 * Math.PI);
				}else{					
					ctx.arc(posX, posY, 7, 1.5708, 1.5708 + (player["flash"]/3000)*(Math.PI));
					ctx.arc(posX, posY, 7, 1.5708,  1.5708 - (player["flash"]/3000)*(Math.PI),true);
				}
				ctx.lineTo(posX,posY);
				ctx.closePath();
				ctx.fill();	
			}	
			
			// circle at the players position
			ctx.beginPath();
			ctx.fillStyle=teamColor;
			ctx.arc(posX, posY, 5, 0, 2 * Math.PI);
			ctx.fill();			
			
			//player health indicator
			if(player["health"]<100){
				ctx.beginPath();				
				ctx.fillStyle="#ff4444";			
				ctx.arc(posX, posY, 4, -1.5708, -1.5708 + ((100-player["health"])/100)*(2 * Math.PI));
				ctx.lineTo(posX,posY);
				ctx.closePath();
				ctx.fill();	
			}		
			
			// triangle pointing the player direction
			var rads = player["dir"] * (Math.PI/180);			
			var triangleX = posX + 8 * Math.cos(rads);
			var triangleY = posY - 8 * Math.sin(rads);			
			ctx.beginPath();	
			ctx.fillStyle=teamColor;			
			ctx.moveTo(triangleX + 4 * Math.cos(rads+2*Math.PI/3) ,triangleY - 4 * Math.sin(rads+2*Math.PI/3));
			ctx.lineTo(triangleX + 3 * Math.cos(rads),triangleY - 3 * Math.sin(rads));
			ctx.lineTo(triangleX + 4 * Math.cos(rads+4*Math.PI/3) ,triangleY - 4 * Math.sin(rads+4*Math.PI/3));
			ctx.closePath();
			ctx.fill();
			
			//reloading
			if(player["rel"]){
				ctx.font = "8px Arial";
				ctx.fillStyle = "#ffffff"		
				ctx.fillText("R", posX+8, posY-7);
			}
			
			//bomb interaction
			if(player["bombInt"]){
				ctx.font = "9px Arial";
				ctx.fillStyle = "#ff0000"			
				ctx.fillText("B", posX+12, posY);
			}
			
			//player name
			ctx.font = "8px Arial";
			ctx.fillStyle = "#bbbbbb";
			ctx.textAlign = "center";
			ctx.fillText(player["name"], posX, posY-12);
			ctx.fillText(weaponList[player["activew"]], posX, posY+17);
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
			
			var [x,y] = transformPosition(inferno[0].X,inferno[0].Y);
			
			ctx.moveTo(x, y);
			inferno.forEach(pos => {
				var [x,y] = transformPosition(pos.X,pos.Y);	
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
	
	//the bomb
	if(game[4]){
		var bombX,bombY;
		if(game[4][2]){
			[bombX,bombY] = transformPosition(game[4][2],game[4][3]);	
			bombX+=8;
			bombY+=8;
		}else{
			[bombX,bombY] = transformPosition(game[4][0],game[4][1]);			
		}			
		ctx.beginPath();
		ctx.fillStyle = "#ff0000";	
		ctx.rect(bombX-3, bombY-3, 6, 6);
		ctx.fill();	
	}
				
	shots.forEach(shot => {
		ctx.beginPath();
		ctx.strokeStyle="#dddddd";		
		rads = shot[2] * (Math.PI/180);		
		ctx.moveTo(shot[0] + 7 * Math.cos(rads),shot[1] - 7 * Math.sin(rads));
		ctx.lineTo(shot[0] + 100 * Math.cos(rads),shot[1] - 100 * Math.sin(rads));
		ctx.stroke();			
	});
	
	smokes.forEach(smoke => {		
			ctx.beginPath();
			ctx.globalAlpha = 0.5;
			ctx.fillStyle="#777777";		
			ctx.arc(smoke[0], smoke[1], 126/finalScale, 0, (2 * Math.PI));
			ctx.fill();			
			ctx.globalAlpha = 1;
			
			ctx.beginPath();
			ctx.strokeStyle="#ffffff";		
			ctx.arc(smoke[0], smoke[1], 126/finalScale, 0, (2 * Math.PI));
			ctx.stroke();	
	});
	
	var tim = new Date().getTime();
	
	heExplosions.forEach(he => {
		if(tim <= he[2]+500){
			ctx.beginPath();
			ctx.strokeStyle="#ffa500";		
			ctx.arc(he[0], he[1], (tim - he[2])/20, 0, (2 * Math.PI));
			ctx.stroke();
		}							
	});
	
	flashExplosions.forEach(flash => {	
		ctx.beginPath();
		ctx.strokeStyle="#ffffff";		
		ctx.arc(flash[0], flash[1], (tim - flash[2])/20, 0, (2 * Math.PI));
		ctx.stroke();								
	});
	

	//score
	ctx.font = "14px Arial";
	ctx.fillStyle = "#ffdd00"
	ctx.textAlign = "right";
	var teamName = game[3][1];
	if(!teamName){
		teamName = "Terrorists";
	}
	ctx.fillText(teamName + " - " + game[3][2], (mapSize/2 -5) + mapOffsetX, 20);
		
	teamName = game[3][3];
	if(!teamName){
		teamName = "Counterterrorists";
	}
	ctx.fillStyle = "#00bbff"
	ctx.textAlign = "left";
	ctx.fillText(game[3][4] + " - " + teamName,  (mapSize/2 +5)+mapOffsetX, 20);
	
	ctx.fillStyle = "#dddddd"
	ctx.textAlign = "right";
	ctx.fillText("round " + (parseInt(game[3][0])+1),  (mapSize/2 -5)+mapOffsetX, 40);

	//timers	
	var tick;
	gettick((t)=>{tick = t});
	
	ctx.font = "14px Arial";
	var seconds = 0;
	var mins = 0;
	if(freezeEndTime==0){
		ctx.fillStyle = "#aaaaff";
		seconds =  parseInt((freezeTime - ((tick - lastRoundStart) * tickInterval))/1000);		
	}else{
		if(bombPlantedTime==0){
			ctx.fillStyle = "#dddddd";
			seconds =  parseInt((roundTime - ((tick - freezeEndTime) * tickInterval))/1000);	
		}else{
			ctx.fillStyle = "#ffaaaa";
			seconds =  parseInt((42000 - ((tick - bombPlantedTime) * tickInterval))/1000);	
		}			
	}
	
	mins = parseInt(seconds/60);	
	seconds = seconds%60;
	if(seconds<10 && seconds >=0){
		seconds="0"+seconds
	}
	
	ctx.textAlign = "left";
	ctx.fillText(mins + ":" + seconds,  (mapSize/2 +5)+mapOffsetX, 40);
	
	
	var txtTime =  ((tick - lastRoundStart) * tickInterval) / 1000;
	
	ctx.font = "14px Arial";
	ctx.fillStyle = "#bbbbbb";
	ctx.textAlign = "left";
	ctx.fillText(txtTime, 10, 20);
		
}