package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"syscall/js"

	dem "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs"
	common "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs/common"
)

const (
	// WASM doesn't enjoy the big buffer sizes allocated by default
	msgQueueBufferSize = 128 * 1024
)

var parser dem.Parser

func main() {
	c := make(chan struct{}, 0)

	dem.DefaultParserConfig = dem.ParserConfig{
		MsgQueueBufferSize: msgQueueBufferSize,
	}

	registerCallbacks()

	fmt.Println("WASM Go Initialized")

	<-c
}

func registerCallbacks() {
	js.Global().Set("parse", js.FuncOf(parse))
	js.Global().Set("parseinit", js.FuncOf(parseinit))
	
	js.Global().Set("parsetick", js.FuncOf(parsetick))	
	js.Global().Set("gettick", js.FuncOf(gettick))	
	
	js.Global().Set("getplayerinfo", js.FuncOf(getplayerinfo))	
}

func parseinit(this js.Value, args []js.Value) interface{} {
	parseinitInternal(args[0], args[1])
	return nil
}

func parseinitInternal(data js.Value, callback js.Value) {
	b := bytes.NewBuffer(uint8ArrayToBytes(data))
	parser = dem.NewParser(b)

	header, err := parser.ParseHeader()
	checkError(err)

	// Return result to JS
	callback.Invoke(header.MapName)
}

func parsetick(this js.Value, args []js.Value) interface{} {
	parser.ParseNextFrame()
	args[0].Invoke("ok")
	return nil
}

func gettick(this js.Value, args []js.Value) interface{} {
	fmt.Println(parser.CurrentFrame())
	return nil
}

func uint8ArrayToBytes(value js.Value) []byte {
	s := make([]byte, value.Get("byteLength").Int())
	js.CopyBytesToGo(s, value)
	return s
}

func getplayerinfo(this js.Value, args []js.Value) interface{} {
	getplayerinfoInternal(args[0])
	return nil
}
func getplayerinfoInternal(callback js.Value) {

	players := parser.GameState().Participants().Playing()
	var info []playerInfo
	for _, player := range players {
		info = append(info, infoFor(player))
	}
	bInfo, err := json.Marshal(info)
	checkError(err)
	callback.Invoke(string(bInfo))	
}

func parse(this js.Value, args []js.Value) interface{} {
	parseInternal(args[0], args[1])
	return nil
}

func parseInternal(data js.Value, callback js.Value) {
	b := bytes.NewBuffer(uint8ArrayToBytes(data))
	parser := dem.NewParser(b)

	header, err := parser.ParseHeader()
	checkError(err)
	// TODO: report headerpointer error
	//fmt.Println("Header:", header)
	fmt.Println("map: " + header.MapName)

	err = parser.ParseToEnd()
	checkError(err)

	fmt.Println("parsed")

	players := parser.GameState().Participants().Playing()
	var stats []playerStats
	for _, p := range players {
		stats = append(stats, statsFor(p))
	}

	bStats, err := json.Marshal(stats)
	checkError(err)

	// Return result to JS
	callback.Invoke(string(bStats))
}

type playerStats struct {
	Name    string `json:"name"`
	Kills   int    `json:"kills"`
	Deaths  int    `json:"deaths"`
	Assists int    `json:"assists"`
}

func statsFor(p *common.Player) playerStats {
	return playerStats{
		Name:    p.Name,
		Kills:   p.Kills(),
		Deaths:  p.Deaths(),
		Assists: p.Assists(),
	}
}

type playerInfo struct {
	Name    string `json:"name"`
	Team    int    `json:"team"`
	Health  int    `json:"health"`
	X  		int    `json:"x"`
	Y  		int    `json:"y"`
}

func infoFor(p *common.Player) playerInfo {
	return playerInfo{
		Name:	p.Name,
		Team:   int(p.Team),
		Health: p.Health(),
		X: 		int(p.LastAlivePosition.X),
		Y: 		int(p.LastAlivePosition.Y),
	}
}

func checkError(err error) {
	if err != nil {
		log.Panic(err)
	}
}
