# CSGO2DReplay
Tool to replay Counter Strike Global Offensive demos in a 2D web interface.

## Dependencies
- [Go](https://golang.org/dl/) (Version 1.16 used)
- [demoinfocs-golang](https://github.com/markus-wa/demoinfocs-golang)

## Quickstart guide
1. Download and install Go -> [golang.org](https://golang.org/dl/) (version 1.16)
|2. Generate the WASM file:
|	inside the "go" folder in this project, run this command: 
|	`GOOS=js GOARCH=wasm go build -o ../web/demoinfocs.wasm main.go`
3. serve the "web" folder in a web server (Xampp for example)
4. open the web app from your browser -> [index.html](localhost/CSGO2DReplay/web/index.html)

### Other info
- Map files from [csgo-overviews](https://github.com/zoidbergwill/csgo-overviews)
