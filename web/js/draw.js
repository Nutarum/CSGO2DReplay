function loadCanvas(){
	var myCanvas = document.getElementById('canvas');
	
	myCanvas.width = mapSize;
	myCanvas.height = mapSize;
	
    ctx = myCanvas.getContext('2d');
		
	background.src = "./resources/de_inferno.png";
	// Make sure the image is loaded first otherwise nothing will draw.
	background.onload = function(){
		ctx.drawImage(background,0,0,mapSize,mapSize);   
	}	
}

function draw(gameJson){
	ctx.clearRect(0,0,mapSize,mapSize);
	ctx.drawImage(background,0,0,mapSize,mapSize);   	
		
	var game = JSON.parse(gameJson);
	
	if(game[1]){
		game[1].forEach(nade => {		
			var [posX,posY] = transformPositionInferno(nade["x"],nade["y"]);		

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
					if(nade["id"] == smoke[3]){
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
	
	game[0].sort(comparaNombres);
	game[0].forEach(player => {		
	
		if(player["team"]==2){
			var teamColor = "#ffdd00"
		}else{
			var teamColor = "#00bbff"
		}
		
		var [posX,posY] = transformPositionInferno(player["x"],player["y"]);
		
		//var posX = player["x"] / 6.208 + 332
		//var posY = mapSize-(player["y"] / 6.208 + 176)
		
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
	
	//the bomb
	if(game[4]){
		var bombX,bombY;
		if(game[4][2]){
			[bombX,bombY] = transformPositionInferno(game[4][2],game[4][3]);	
			bombX+=8;
			bombY+=8;
		}else{
			[bombX,bombY] = transformPositionInferno(game[4][0],game[4][1]);			
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
		if(smoke[2]>10){ //los 10 ultimos ticks los dejamos para que no se dibuje la granada tirada en el suelo, aunque en el mapa ya no se este dibujando el efecto del humo
			ctx.beginPath();
			ctx.globalAlpha = 0.5;
			ctx.fillStyle="#777777";		
			ctx.arc(smoke[0], smoke[1], 20, 0, (2 * Math.PI));
			ctx.fill();			
			ctx.globalAlpha = 1;
			
			ctx.beginPath();
			ctx.strokeStyle="#ffffff";		
			ctx.arc(smoke[0], smoke[1], 20, 0, (2 * Math.PI));
			ctx.stroke();			
		}		
	});
	
	heExplosions.forEach(he => {
		if(he[2]>190){			
			ctx.beginPath();
			ctx.strokeStyle="#ffa500";		
			ctx.arc(he[0], he[1], (200-he[2])*2, 0, (2 * Math.PI));
			ctx.stroke();
		}			
	});
	
	flashExplosions.forEach(flash => {			
		ctx.beginPath();
		ctx.strokeStyle="#ffffff";		
		ctx.arc(flash[0], flash[1], (10-flash[2])*2, 0, (2 * Math.PI));
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