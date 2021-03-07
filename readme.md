# CSGO2DReplay
Tool to replay Counter Strike Global Offensive demos in a 2D web interface.

## Dependencies
- [Go](https://golang.org/dl/) (Version 1.16 used)
- [demoinfocs-golang](https://github.com/markus-wa/demoinfocs-golang)

## Quickstart guide
1. Download and install Go -> [golang.org](https://golang.org/dl/) (version 1.16)  
If you are using other version of GO, you might need to replace the file "web/wasm_exec.js" with the one found in your GO folder at "misc/wasm/"
2. Generate the WASM file:  
You need to generate a new WASM file each time you modify the ".go" files (you can skip this if you dont modify the .go files).  
To do this, inside the "go" folder in this project, run this command from cmd:   
`GOOS=js GOARCH=wasm go build -o ../web/wasm/demoinfocs.wasm main.go`
3. Serve the "web" folder in a web server (Xampp for example)
4. Open the web app from your browser -> [index.html](http://localhost/CSGO2DReplay/web/index.html)

### Other info
- Map files from [csgo-overviews](https://github.com/zoidbergwill/csgo-overviews)
- Example of how to use [demoinfocs-golang](https://github.com/markus-wa/demoinfocs-golang) from javascript at [demoinfocs-wasm](https://github.com/markus-wa/demoinfocs-wasm)

### ToDo
Active smokes
Flashed players
Bomb (in a player, ground, or planted)
Round timers
Fix position conversion to be exact
Time control, round control (and try to make faster the skip to certain point)
Positions for other maps (Mirage, Dust, Overpass, Vertigo, Nuke, Train, Cache)
Players HUD (player hp, active weapon, money...)