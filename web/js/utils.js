function testpos(x,y){
	[nx,ny] = transformPositionInferno(x,y);
	ctx.beginPath();
	ctx.fillStyle = "#ff0000";
	ctx.arc(nx, ny, 2, 0, 2 * Math.PI);
	ctx.fill();
}

function transformPositionInferno(x,y){
	return [x/6.208 + 332, mapSize - (y/6.208+179)];
}

function comparaNombres(a, b) {
  if (a["name"]<b["name"]) {
    return -1;
  }
  return 1;
}
