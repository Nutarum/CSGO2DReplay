var ctx;
var background = new Image();

var mapOffsetX = 200;
var mapSize = 800;

window.onload = function() {
	loadCanvas();	
	loadWeaponList();
};

document.addEventListener('DOMContentLoaded', function () {
	//when DOM is loaded, load WASM
	const go = new Go();
	WebAssembly.instantiateStreaming(fetch("./wasm/demoinfocs.wasm"), go.importObject).then((result) => {
		go.run(result.instance);
		document.getElementById("demofile").disabled = false;
	});
	
}, false);


