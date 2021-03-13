# CSGO2DReplay
Tool to replay Counter Strike Global Offensive demos in a 2D web interface.  
Currently hosted here: [CSGO2DReplay](https://csgo2dreplay.firebaseapp.com/)

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
- Map files from [csgo-overviews](https://github.com/zoidbergwill/csgo-overviews) and [simpleradar](https://readtldr.gg/simpleradar).
- Example of how to use [demoinfocs-golang](https://github.com/markus-wa/demoinfocs-golang) from javascript at [demoinfocs-wasm](https://github.com/markus-wa/demoinfocs-wasm)

### ToDo
- Improve controls, and add shortcuts
- Make canvas size scalable
- Implement Z-position for nuke and vertigo
- Try to make returning to a previous tick faster

### Minor bugs
- If game playback speed is paused, HE nades show themself again when HE animation is over.
