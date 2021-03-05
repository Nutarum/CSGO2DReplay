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

function parseFile() {
	console.log('reading demo');
	state("reading demo");

	const reader = new FileReader();
	reader.onload = function () {
		const data = reader.result;
		const bytes = new Uint8Array(data);
		console.log('parsing');
		state("parsing");
		parseinit(bytes, (mapname) => console.log(mapname));
	};
	reader.readAsArrayBuffer(document.getElementById('demofile').files[0])
}


function parseTick() {
	parsetick((e) =>console.log("TICK"));
}

function parse1000() {
	for (var i = 0; i < 1000; i++) {
		parsetick((e) =>{});
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
	
		
		ctx.strokeStyle = "#006600";
		ctx.beginPath();
		
		var newX = player["x"] / 6.208 + 336
		var newY = 800-(player["y"] / 6.208 + 180)
		
		ctx.arc(newX, newY, 5, 0, 2 * Math.PI);
		ctx.stroke();		
		
		
	});
}

function processNextTick(){
	parsetick((e) =>{		
		getPlayerInfo();
	});
}

function play(){	
	var t=setInterval(processNextTick,10);		
}

function getPlayerInfo() {
	getplayerinfo((players) =>{
		draw(players)		
	});
}

function state(state) {
	document.getElementById('state').innerText = state;
}