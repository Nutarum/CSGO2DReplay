package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"syscall/js"

	dem "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs"
	common "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs/common"
	events "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs/events"
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
	js.Global().Set("parseinit", js.FuncOf(parseinit))
	
	js.Global().Set("parsetick", js.FuncOf(parsetick))	
	js.Global().Set("gettick", js.FuncOf(gettick))	
	
	js.Global().Set("getgameinfo", js.FuncOf(getgameinfo))	
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
	
	registerEvents()

	var returnValue []interface{}
	
	returnValue = append(returnValue,header.MapName)
	returnValue = append(returnValue,parser.TickRate())
	
	bInfo, err := json.Marshal(returnValue)
	checkError(err)
	callback.Invoke(string(bInfo))
}

func registerEvents(){	
	parser.RegisterEventHandler(func(e events.WeaponFire){
		js.Global().Call("fireEvent", []interface{}{e.Shooter.LastAlivePosition.X, e.Shooter.LastAlivePosition.Y, e.Shooter.ViewDirectionX()})
	});		
	parser.RegisterEventHandler(func(events.RoundStart){		
		js.Global().Call("roundStart")
	});		
	parser.RegisterEventHandler(func(e events.SmokeStart){
		js.Global().Call("smokeStart", []interface{}{e.Position.X, e.Position.Y, e.GrenadeEntityID})
	});	
	parser.RegisterEventHandler(func(e events.HeExplode){
		js.Global().Call("heExplode", []interface{}{e.Position.X, e.Position.Y, e.GrenadeEntityID})
	});	
	parser.RegisterEventHandler(func(e events.FlashExplode){
		js.Global().Call("flashExplode", []interface{}{e.Position.X, e.Position.Y, e.GrenadeEntityID})
	});	
}

func parsetick(this js.Value, args []js.Value) interface{} {
	parser.ParseNextFrame()
	return nil
}

func gettick(this js.Value, args []js.Value) interface{} {
	args[0].Invoke(parser.GameState().IngameTick())
	return nil
}

func uint8ArrayToBytes(value js.Value) []byte {
	s := make([]byte, value.Get("byteLength").Int())
	js.CopyBytesToGo(s, value)
	return s
}

func getgameinfo(this js.Value, args []js.Value) interface{} {
	getgameinfoInternal(args[0])
	return nil
}

func getgameinfoInternal(callback js.Value) {
	
	var returnValue []interface{}
	
	players := parser.GameState().Participants().Playing()
	var infoP []playerInfo
	for _, player := range players {
		infoP = append(infoP, infoForPlayer(player))
	}
	
	returnValue = append(returnValue,infoP)
	nades := parser.GameState().GrenadeProjectiles()
	var infoN []nadeInfo
	for _, nade := range nades {
		//fmt.Println(nade)
		infoN = append(infoN, infoForNade(nade))
	}
	
	returnValue = append(returnValue,infoN)
	
	infernos := parser.GameState().Infernos()
	var infoI []interface{}
	for _, inferno := range infernos {		
		infoI = append(infoI, inferno.Fires().ConvexHull2D())
	}	
	
	returnValue = append(returnValue,infoI)
	
	var scoreInfo []interface{}
	scoreInfo = append(scoreInfo,parser.GameState().TotalRoundsPlayed())
	scoreInfo = append(scoreInfo,parser.GameState().Team(2).ClanName())
	scoreInfo = append(scoreInfo,parser.GameState().Team(2).Score())
	scoreInfo = append(scoreInfo,parser.GameState().Team(3).ClanName())
	scoreInfo = append(scoreInfo,parser.GameState().Team(3).Score())
	
	returnValue = append(returnValue,scoreInfo)
	
	var bombInfo []interface{}
	bombInfo = append(bombInfo,parser.GameState().Bomb().LastOnGroundPosition.X)
	bombInfo = append(bombInfo,parser.GameState().Bomb().LastOnGroundPosition.Y)
	if(parser.GameState().Bomb().Carrier!=nil){
		bombInfo = append(bombInfo,parser.GameState().Bomb().Carrier.Position().X)
		bombInfo = append(bombInfo,parser.GameState().Bomb().Carrier.Position().Y)
	}	
	
	returnValue = append(returnValue,bombInfo)
	
	bInfo, err := json.Marshal(returnValue)
	checkError(err)
	callback.Invoke(string(bInfo))	
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
	Name    		string `json:"name"`
	Team    		int    `json:"team"`
	Health  		int    `json:"health"`
	X  				int    `json:"x"`
	Y  				int    `json:"y"`
	Dir				int    `json:"dir"`
	Reloading		bool   `json:"rel"`
	InteractingBomb bool   `json:"bombInt"`
	Flashed			int    `json:"flash"`
}

func infoForPlayer(p *common.Player) playerInfo {
	return playerInfo{
		Name:				p.Name,
		Team:  				int(p.Team),
		Health:				p.Health(),
		X: 					int(p.LastAlivePosition.X),
		Y: 					int(p.LastAlivePosition.Y),
		Dir: 				int(p.ViewDirectionX()),
		Reloading: 			p.IsReloading,
		InteractingBomb: 	p.IsDefusing || p.IsPlanting,
		Flashed:			int(p.FlashDurationTimeRemaining().Milliseconds()),
	}
}

type nadeInfo struct {
	X    int `json:"x"`
	Y    int `json:"y"`
	Type int `json:"type"`
	Id 	int  `json:"id"`
}

func infoForNade(n *common.GrenadeProjectile) nadeInfo {
	return nadeInfo{
		X:		int(n.Position().X),
		Y:  	int(n.Position().Y),
		Type:  	int(n.WeaponInstance.Type),
		Id:  	n.Entity.ID(),
	}
}

func checkError(err error) {
	if err != nil {
		log.Panic(err)
	}
}
