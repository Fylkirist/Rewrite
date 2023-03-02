class Tile{
  	constructor(properties){
    	this.type = properties.type
    	this.collision = properties.collision
		this.event = properties.event
		this.spriteCut = {
			x:properties.spriteX,
			y:properties.spriteY
		}
  	}
	render(context,coords){
		context.drawImage(tileSheet,this.spriteCut.x,this.spriteCut.y,16,16,coords.x,coords.y,16,16)
	}
}
const tileDict = {
	greenTile: new Tile({
		spriteX:111,
		spriteY:72,
		event:false,
	  	collision:false,
		type:"none"
		}
	),
	greenGrassTile: new Tile({
		spriteX:63,
		spriteY:72,
		event:{chance:0.10,event:"battle"},
	  	collision:false,
		type:"none"
		}
	)
}

class Menu{
	constructor(width, content, previous){
		this.content = content
		this.pointer = 0
		this.width = width
		this.previous = previous
	}
	render(){
		let container = document.createElement("div")
		container.className = "menuContainer"
		container.style.gridTemplateColumns = `repeat(${this.width},1fr)`
		for(let i=0;i<this.content.length;i++){
			let menuElem = document.createElement("div")
			menuElem.textContent = this.content[i].text
			menuElem.className = "menuElement"
			if(this.pointer === i){
				menuElem.classList.add("selectedMenuElem")
			}
			container.appendChild(menuElem)
		}
		return container
	}
	handleInput(input){
		switch(input.key){
			case "ArrowLeft":
				if(this.pointer>0){
					this.pointer--
				}
				break
			case "ArrowRight":
				if(this.pointer<this.content.length-1){
					this.pointer++
				}
				break
			case "ArrowUp":
				if(this.pointer-this.width>=0){
					this.pointer-=this.width
				}
				break
			case "ArrowDown":
				if(this.pointer+this.width<this.content.length){
					this.pointer+=this.width
				}
				break
			case "a":
				this.content[this.pointer].action()
				break
			case "s":
				this.previous()
				break
		}
	}
}

class FullScreenMenu extends Menu{
	constructor(width, content, previous){
		super(width,content,previous)
		
		this.subMenu = false
	}
	render(){
		let menuContainer = document.createElement("div")
		menuContainer.className = "overworldPartyMenuContainer"
		
		for(let i = 0; i < this.content.length; i++){
			let menuElem = document.createElement("div")
			menuElem.className="overworldPartyMenuElement"
			if(this.pointer === i){
				menuElem.classList.add("overworldPartySelectedElem")
			}

			let elemPic = document.createElement("img")
			elemPic.className = "overworldPartyMenuPic"
			elemPic.src = this.content[i].sprites.front_default

			let elemName = document.createElement("label")
			elemName.className = "overworldPartyMenuName"
			elemName.textContent = this.content[i].name

			let elemLevel = document.createElement("label")
			elemLevel.className = "overworldPartyMenuLevel"
			elemLevel.textContent = `lvl. ${this.content[i].level}`

			let elemHealthLabel = document.createElement("label")
			elemHealthLabel.className = "overworldPartyMenuHealthLabel"
			elemHealthLabel.textContent = `${this.content[i].currentHP}/${this.content[i].stats.hp}`

			let elemHealthBarParent = document.createElement("div")
			elemHealthBarParent.className = "overworldPartyMenuHealthBarParent"

			let elemHealthBarChild = document.createElement("div")
			elemHealthBarChild.className = "overworldPartyMenuHealthBarChild"
			elemHealthBarChild.style.width = `${this.content[i].currentHP/this.content[i].stats.hp*100}%`
			elemHealthBarParent.appendChild(elemHealthBarChild)

			menuElem.appendChild(elemPic)
			menuElem.appendChild(elemName)
			menuElem.appendChild(elemLevel)
			menuElem.appendChild(elemHealthLabel)
			menuElem.appendChild(elemHealthBarParent)
			menuContainer.appendChild(menuElem)
		}
		if(this.subMenu){
				let subMenuElem = this.subMenu.render()
				menuContainer.appendChild(subMenuElem)
			}
		return menuContainer
	}
	handleInput(input){
		if(this.subMenu){
			this.subMenu.handleInput(input)
		}
		else{
			switch(input.key){
				case "ArrowLeft":
					if(this.pointer>0){
						this.pointer--
					}
					break
				case "ArrowRight":
					if(this.pointer<this.content.length-1){
						this.pointer++
					}
					break
				case "ArrowUp":
					if(this.pointer-this.width>=0){
						this.pointer-=this.width
					}
					break
				case "ArrowDown":
					if(this.pointer+this.width<this.content.length){
						this.pointer+=this.width
					}
					break
				case "a":
					this.subMenu = new Menu(1,[{text:"Switch",action:""},{text:"Summary",action:""},{text:"",action:""},{text:"",action:""}],(()=>{this.subMenu = false}))
					break
				case "s":
					this.previous()
					break
			}	
		}
	}
}

class Dialogue{
	constructor(content){
		this.content = content
		this.pointer = 0
	}
	render(){
		let dialogueWindow = document.createElement("div")
		dialogueWindow.className = "NPCDialogueWindowContainer"

		let dialogueText = document.createElement("div")
		dialogueText.className = "NPCDialogueText"
		dialogueText.textContent = `${this.content[this.pointer].text}`

		dialogueWindow.appendChild(dialogueText)

		if(this.content[this.pointer].menu){
			let dialogueMenu = this.content[this.pointer].menu.render()
			dialogueMenu.id = "overworldDialogueMenu"
			dialogueWindow.appendChild(dialogueMenu)
		}
		return dialogueWindow
	}
	handleInput(input){
		if(this.content[this.pointer].menu){
			this.content[this.pointer].menu.action(input)
		}
		
	}
}

class MapState{
  	constructor(properties){
		this.grid = properties.grid
		this.encounters = properties.encounters
		this.characters = properties.characters
  	}
}

class MapStateCollection{
	constructor(){
		this.mapStates = [
			new MapState({grid:[
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile],
				[tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile],
				[tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile],
				[tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile],
				[tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile],
				[tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile,tileDict.greenGrassTile]
			],encounters:[
				createNewPokemon("bulbasaur",10,[]),createNewPokemon("charmander",10,[])
			],characters:[
				new Character({name:"bruh",
				posX:1,
				posY:1,
				facing:"south",
				flags:{},
				type:"trainer",
				dialogue:new Dialogue([{text:"Test 1",},{text:"Test 2",menu: new Menu(1,[{text:"yes",action:""},{text:"no",action:""}])}]),
				party:[],
				sprite:{
					"south":{x:1,y:1},
					"east":{x:1,y:1},
					"north":{x:1,y:1},
					"west":{x:1,y:1}
				},
				reward:1500})
			]})
		]
	}
}

class Scene{
  	constructor(player, menus){
		this.player = player
		this.menus = menus
		this.currentMenu = "main"
  	}
	changeMenu(menuKey){
		this.currentMenu = menuKey
	}
	createMenuInstance(key,properties){
		this.menus[key] = new Menu(properties.width, properties.content, properties.previous)
		this.currentMenu = key
	}
}

class TitleScreen extends Scene{
	constructor(state){
		super(null,
			{"main":new Menu(2,[
				{text:"New Game",action:()=>state.newGame()},
				{text:"Load Game",action:()=>{if(state.saveSlot!=""){state.loadSave()}}}],null)})
	}
	render(){
		let titleContainer = document.createElement("div")
		titleContainer.style.width = "100%"
		titleContainer.style.height = "100%"

		let backgroundImg = document.createElement("img")
		backgroundImg.id = "titleScreenBackground"
		backgroundImg.src = "../assets/GoldTitle.png"
		titleContainer.appendChild(backgroundImg)

		let menu = this.menus[this.currentMenu].render()
		menu.id = "titleScreenMenu"
		
		titleContainer.appendChild(menu)
		return titleContainer
	}
	handleInput(input){
		this.menus["main"].handleInput(input)
	}
}

class Overworld extends Scene{
  	constructor(player,map,state){
		super(player)
		this.characters = map.characters
		this.mapGrid = map.grid
		this.encounters = map.encounters
		this.menus = {
			"start": new Menu(1,[
				{text:"Save game",action:()=>{state.saveGame()}},
				{text:"Load game",action:()=>{state.loadSave()}},
				{text:"PKMN",action:()=>{this.openPartyMenu()}},
				{text:"Backpack",action:()=>{this.openBagMenu()}},
				{text:"Player info",action:()=>{this.showPlayerInfo()}},
				{text:"PokeDex",action:()=>{this.showDex()}},
				{text:"Map",action:()=>{this.showMap()}}
			],()=>this.changeMenu("none"))
		}
		this.currentMenu = "none"
  	}
	render(){
		let sceneContainer = document.createElement("div")
		sceneContainer.id = "overworldSceneContainer"
		let backGroundLayer = document.createElement("canvas")
		backGroundLayer.id = "overworldBackgroundLayer"
		backGroundLayer.width = 400
		backGroundLayer.height = 400
		let BGctx = backGroundLayer.getContext("2d")
		BGctx.fillStyle = "black";
		BGctx.fillRect(0,0, 400, 400);
		for(let row = this.player.posY - 13; row < this.player.posY + 12; row++){
			for(let column = this.player.posX - 13; column < this.player.posX + 12; column++){
				if(row>=0 && row<this.mapGrid.length && column>=0 && column<this.mapGrid[row].length){
					this.mapGrid[row][column].render(BGctx,{x:(column - (this.player.posX - 13))*16-8,y:(row-(this.player.posY - 13))*16-8})
				}
			}
		}
		sceneContainer.appendChild(backGroundLayer)
		this.characters.forEach(char => {
			if(char.posX>this.player.posX-12 && 
				char.posX<this.player.posX+13 && 
				char.posY>this.player.posY-12 && 
				char.posY<this.player.posY+13){
				char.render({situation:"overworld",context:BGctx,x:(char.posX-this.player.posX+13)*16-8,y:(char.posY-this.player.posY+13)*16-8})
			}
		});
		this.player.render({situation:"overworld",context:BGctx})
		if(this.currentMenu!="none"){
			let dynamicMenu = this.menus[this.currentMenu].render()
			dynamicMenu.id = "overworldMenu"
			sceneContainer.appendChild(dynamicMenu)
		}
		
		return sceneContainer
	}
	changeMenu(key){
		this.currentMenu = key
	}
	
	
	handleInput(input){
		if(this.currentMenu!="none"){
			this.menus[this.currentMenu].handleInput(input)
		}
		else{
			console.log(this.player.posY,this.player.posX)
			const dirDict = {
				"ArrowUp":"north",
				"ArrowDown":"south",
				"ArrowRight":"east",
				"ArrowLeft":"west",
			}
			switch(input.key){
				case "ArrowUp":
				case "ArrowDown":
				case "ArrowRight":
				case "ArrowLeft":
					this.handleMove(dirDict[input.key], this.player)
					break
				case "x":
					this.changeMenu("start")
			}
		}
	}
	handleMove(direction, char){
		const dirTranslate={
			"north":{x:0,y:-1},
			"south":{x:0,y:1},
			"east":{x:1,y:0},
			"west":{x:-1,y:0},
		}
		console.log(direction,dirTranslate[direction])
		if(char.facing != direction){
			char.facing = direction
			return
		}
		let charCollision = false
		for(let i = 0; i < this.characters.length; i++){
			if(this.characters[i].posX == char.posX+dirTranslate[direction].x && this.characters[i].posY == char.posY+dirTranslate[direction].y){
				charCollision = true
			}
		}
		if(char.posX+dirTranslate[direction].x >= 0 && 
			char.posX+dirTranslate[direction].x < this.mapGrid[char.posY].length && 
			char.posY+dirTranslate[direction].y >=0 &&
			char.posY+dirTranslate[direction].y < this.mapGrid.length &&
			this.mapGrid[char.posY+dirTranslate[direction].y][char.posX+dirTranslate[direction].x].collision == false &&
			charCollision == false){
			char.posX += dirTranslate[direction].x
			char.posY += dirTranslate[direction].y
		}
	}
	openPartyMenu(){
		this.menus["party"] = new FullScreenMenu(2,
		this.player.party,
		(()=>{this.changeMenu("start")})
		)
		this.changeMenu("party")
	}
	openBagMenu(){
		this.menus["bag"] = new Menu(1,
			this.player.items.map(elem => {

			}),
			this.changeMenu("party"))
	}
}


class Battle extends Scene{
    constructor(options){
		super(options.player)
		this.state = options.state
		this.turn = 0
		this.encounterType = options.encounterType
        this.typeTable={
            "normal": {"normal": 1, "fire": 1, "water": 1, "electric": 1, "grass": 1, "ice": 1, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 0.5, "ghost": 0, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 1,"none":1},
            "fire": {"normal": 1, "fire": 0.5, "water": 0.5, "electric": 1, "grass": 2, "ice": 2, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 2, "rock": 0.5, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 2, "fairy": 1,"none":1},
            "water": {"normal": 1, "fire": 2, "water": 0.5, "electric": 1, "grass": 0.5, "ice": 1, "fighting": 1, "poison": 1, "ground": 2, "flying": 1, "psychic": 1, "bug": 1, "rock": 2, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 1, "fairy": 1,"none":1},
            "electric": {"normal": 1, "fire": 1, "water": 2, "electric": 0.5, "grass": 0.5, "ice": 1, "fighting": 1, "poison": 1, "ground": 0, "flying": 2, "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 1, "fairy": 1,"none":1},
            "grass": {"normal": 1, "fire": 0.5, "water": 2, "electric": 1, "grass": 0.5, "ice": 1, "fighting": 1, "poison": 0.5, "ground": 2, "flying": 0.5, "psychic": 1, "bug": 0.5, "rock": 2, "ghost": 1, "dragon": 0.5, "dark": 1, "steel": 0.5, "fairy": 1,"none":1},
            "ice": {"normal": 1, "fire": 0.5, "water": 0.5, "electric": 1, "grass": 1, "ice": 0.5, "fighting": 1, "poison": 1, "ground": 2, "flying": 2, "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 2, "dark": 1, "steel": 0.5, "fairy": 1,"none":1},
            "fighting": {"normal": 2, "fire": 1, "water": 1, "electric": 1, "grass": 1, "ice": 2, "fighting": 1, "poison": 0.5, "ground": 1, "flying": 0.5, "psychic": 0.5, "bug": 0.5, "rock": 2, "ghost": 0, "dragon": 1, "dark": 2, "steel": 2, "fairy": 0.5,"none":1},
            "poison": {"normal": 1, "fire": 1, "water": 1, "electric": 1, "grass": 2, "ice": 1, "fighting": 1, "poison": 0.5, "ground": 0.5, "flying": 1, "psychic": 1, "bug": 1, "rock": 0.5, "ghost": 0.5, "dragon": 1, "dark": 1, "steel": 0, "fairy": 2,"none":1},
            "ground": {"normal": 1, "fire": 2, "water": 1, "electric": 2, "grass": 0.5, "ice": 1, "fighting": 1, "poison": 2, "ground": 1, "flying": 0, "psychic": 1, "bug": 0.5, "rock": 2, "ghost": 1, "dragon": 1, "dark": 1, "steel": 2, "fairy": 1,"none":1},
            "flying": {"normal": 1, "fire": 1, "water": 1, "electric": 0.5, "grass": 2, "ice": 1, "fighting": 2, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 2, "rock": 0.5, "ghost": 1, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 1,"none":1},
            "psychic": {"normal": 1, "fire": 1, "water": 1, "electric": 1, "grass": 1, "ice": 1, "fighting": 2, "poison": 2, "ground": 1, "flying": 1, "psychic": 0.5, "bug": 1, "rock": 1, "ghost": 1, "dragon": 1, "dark": 0, "steel": 0.5, "fairy": 1,"none":1},
            "bug": {"normal": 1, "fire": 0.5, "water": 1, "electric": 1, "grass": 2, "ice": 1, "fighting": 0.5, "poison": 0.5, "ground": 1, "flying": 0.5, "psychic": 2, "bug": 1, "rock": 1, "ghost": 0.5, "dragon": 1, "dark": 2, "steel": 0.5, "fairy": 0.5,"none":1},
            "rock": {"normal": 1, "fire": 2, "water": 1, "electric": 1, "grass": 1, "ice": 2, "fighting": 0.5, "poison": 1, "ground": 0.5, "flying": 2, "psychic": 1, "bug": 2, "rock": 1, "ghost": 1, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 1,"none":1},
            "ghost": {"normal": 0, "fire": 1, "water": 1, "electric": 1, "grass": 1, "ice": 1, "fighting": 1, "poison": 1, "ground": 1, "flying": 1, "psychic": 2, "bug": 1, "rock": 1, "ghost": 2, "dragon": 1, "dark": 0.5, "steel": 1, "fairy": 1,"none":1},
            "dragon": {"normal": 1, "fire": 1, "water": 1, "electric": 1, "grass": 1, "ice": 1, "fighting": 0.5, "poison": 1, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 2, "dark": 1, "steel": 0.5, "fairy": 0,"none":1},
            "dark": {"normal": 1, "fire": 1, "water": 1, "electric": 1, "grass": 1, "ice": 1, "fighting": 0.5, "poison": 1, "ground": 1, "flying": 1, "psychic": 2, "bug": 1, "rock": 1, "ghost": 2, "dragon": 1, "dark": 0.5, "steel": 1, "fairy": 0.5,"none":1},
            "steel": {"normal": 1, "fire": 0.5, "water": 0.5, "electric": 0.5, "grass": 1, "ice": 2, "fighting": 2, "poison": 0, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 2, "ghost": 1, "dragon": 1, "dark": 1, "steel": 0.5, "fairy": 2,"none":1},
            "fairy": {"normal": 1, "fire": 0.5, "water": 1, "electric": 1, "grass": 1, "ice": 1, "fighting": 2, "poison": 0.5, "ground": 1, "flying": 1, "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 2, "dark": 2, "steel": 0.5, "fairy": 1,"none":1}
        }
		this.enemy = options.enemy
		this.menus = {
			"main": new Menu(2,[
				{text:"Fight",action:() => this.createMenuInstance("fight",
				{previous:"main", 
				width:2, 
				content:this.player.party[0].moves.map(move => {
					return {text:move.name, action:() => this.selectAction("move", move)}
				}),previous:()=>this.changeMenu("main")})},
				{text:"Items",action:()=>this.changeMenu("items")},
				{text:"PKMN",action:()=>this.openPartyMenu()},
				{text:"Run",action:() => this.fleeBattle()}
			],this.changeMenu("main"))
		}
    }
	render(){
		let backgroundGrid = document.createElement("div")
		backgroundGrid.id="battleContainer"

		let enemyInfoBox = this.renderInfoBox(this.enemy.party[0])
		enemyInfoBox.id = "BattleEnemyInfoContainer"

		let enemySpriteContainer = document.createElement("div")
		enemySpriteContainer.id = "BattleEnemySpriteContainer"
		enemySpriteContainer.appendChild(this.enemy.party[0].render("facing"))

		let playerInfoBox = this.renderInfoBox(this.player.party[0])
		playerInfoBox.id = "battlePlayerInfoBox"

		let	playerSpriteContainer = document.createElement("div")
		playerSpriteContainer.id = "BattlePlayerSpriteContainer"
		playerSpriteContainer.appendChild(this.player.party[0].render("away"))

		let menuContainer = document.createElement("div")
		menuContainer.id = "battleMenuContainer"

		let battleOrderInfo = document.createElement("div")
		battleOrderInfo.id = "battleMenuInfoBox"

		let actionMenu = document.createElement("div")
		actionMenu.id = "actionMenuGrid"
		
		menuContainer.appendChild(battleOrderInfo)
		menuContainer.appendChild(actionMenu)

		backgroundGrid.appendChild(enemyInfoBox)
		backgroundGrid.appendChild(enemySpriteContainer)
		backgroundGrid.appendChild(playerSpriteContainer)
		backgroundGrid.appendChild(playerInfoBox)
		backgroundGrid.appendChild(menuContainer)

		let dynamicMenu = this.menus[this.currentMenu].render()
		dynamicMenu.id = `battle${this.currentMenu}menu`
		backgroundGrid.appendChild(dynamicMenu)
		return backgroundGrid
	}
	renderInfoBox(pokemon){
		let infoBox = document.createElement("div")
		infoBox.className = "BattleInfoContainer"

		let name = document.createElement("label")
		name.textContent = pokemon.name

		let level = document.createElement("label")
		level.textContent = `lv.${pokemon.level}`

		let healthBarParent = document.createElement("div")
		healthBarParent.className = "BattleHealthBarParent"
		
		let healthBarChild = document.createElement("div")
		healthBarChild.className = "BattleHealthBarChild"
		healthBarChild.style.width = `${(pokemon.currentHP/pokemon.stats.hp)*100}%`
		healthBarParent.appendChild(healthBarChild)

		let gender = document.createElement("label")
		if(pokemon.gender === "male"){
			gender.textContent = "♂"
		}
		else if(pokemon.gender === "female"){
			gender.textContent = "♀"
		}
		
		infoBox.appendChild(name)
		infoBox.appendChild(gender)
		infoBox.appendChild(level)
		infoBox.appendChild(healthBarParent)

		return infoBox
	}
	handleInput(input){
		this.menus[this.currentMenu].handleInput(input)
	}
	selectAction(type, action){
		
	}
	handleBattleLogic(playerAction){

	}
	fleeBattle(){
		this.state.backToOverworld()
	}
	openPartyMenu(){
		this.menus["party"] = new FullScreenMenu(2,this.player.party,()=>this.changeMenu("main"))
		this.changeMenu("party")
	}
}

class NewCharScreen{
	constructor(state){
		this.name = []
		this.gender = "male"
		this.menus = new Menu(9,[
			{text:"A",action:()=>this.name.push("A")},
			{text:"B",action:()=>this.name.push("B")},
			{text:"C",action:()=>this.name.push("C")},
			{text:"D",action:()=>this.name.push("D")},
			{text:"E",action:()=>this.name.push("E")},
			{text:"F",action:()=>this.name.push("F")},
			{text:"G",action:()=>this.name.push("G")},
			{text:"H",action:()=>this.name.push("H")},
			{text:"I",action:()=>this.name.push("I")},
			{text:"J",action:()=>this.name.push("J")},
			{text:"K",action:()=>this.name.push("K")},
			{text:"L",action:()=>this.name.push("L")},
			{text:"M",action:()=>this.name.push("M")},
			{text:"N",action:()=>this.name.push("N")},
			{text:"O",action:()=>this.name.push("O")},
			{text:"P",action:()=>this.name.push("P")},
			{text:"Q",action:()=>this.name.push("Q")},
			{text:"R",action:()=>this.name.push("R")},
			{text:"S",action:()=>this.name.push("S")},
			{text:"T",action:()=>this.name.push("T")},
			{text:"U",action:()=>this.name.push("U")},
			{text:"V",action:()=>this.name.push("V")},
			{text:"W",action:()=>this.name.push("W")},
			{text:"X",action:()=>this.name.push("X")},
			{text:"Y",action:()=>this.name.push("Y")},
			{text:"Z",action:()=>this.name.push("Z")},
			{text:"_",action:()=>this.name.push(" ")},
			{text:"a",action:()=>this.name.push("a")},
			{text:"b",action:()=>this.name.push("b")},
			{text:"c",action:()=>this.name.push("c")},
			{text:"d",action:()=>this.name.push("d")},
			{text:"e",action:()=>this.name.push("e")},
			{text:"f",action:()=>this.name.push("f")},
			{text:"g",action:()=>this.name.push("g")},
			{text:"h",action:()=>this.name.push("h")},
			{text:"i",action:()=>this.name.push("i")},
			{text:"j",action:()=>this.name.push("j")},
			{text:"k",action:()=>this.name.push("k")},
			{text:"l",action:()=>this.name.push("l")},
			{text:"m",action:()=>this.name.push("m")},
			{text:"n",action:()=>this.name.push("n")},
			{text:"o",action:()=>this.name.push("o")},
			{text:"p",action:()=>this.name.push("p")},
			{text:"q",action:()=>this.name.push("q")},
			{text:"r",action:()=>this.name.push("r")},
			{text:"s",action:()=>this.name.push("s")},
			{text:"t",action:()=>this.name.push("t")},
			{text:"u",action:()=>this.name.push("u")},
			{text:"v",action:()=>this.name.push("v")},
			{text:"w",action:()=>this.name.push("w")},
			{text:"x",action:()=>this.name.push("x")},
			{text:"y",action:()=>this.name.push("y")},
			{text:"z",action:()=>this.name.push("z")},
			{text:"end",action:()=>{state.initializeNewGame(this)}},
			{text:"<-",action:()=>{if(this.name.length>0){
				this.name.pop()
			}}},
			{text:"clear",action:()=>{this.name = []}},
			{text:"♂",action:()=>{this.gender="male"}},
			{text:"♀",action:()=>{this.gender="female"}},
			{text:"back",action:()=>{state.start()}}
		])
		
	}
	render(){
		let newCharBackground = document.createElement("div")
		newCharBackground.id = "newCharMenuBackground"

		let newCharInfoContainer = document.createElement("div")
		newCharInfoContainer.id = "newCharInfoContainer"

		let playerSprite = document.createElement("img")
		if(this.gender==="male"){
			playerSprite.src = "../assets/maleTestSprite.png"
		}
		else{
			playerSprite.src = "../assets/femaleTestSprite.png"
		}
		newCharInfoContainer.appendChild(playerSprite)
		let nameContainer =  document.createElement("div")
		nameContainer.id = "newCharNameContainer"
		for(let i = 0; i < 10; i++){
			let charSpan = document.createElement("span")
			charSpan.style.margin = "3px"
			if(this.name.length>i){
				charSpan.textContent = this.name[i]
			}
			else{
				charSpan.textContent = "_"
			}
			nameContainer.appendChild(charSpan)
		}
		newCharInfoContainer.appendChild(nameContainer)
		newCharBackground.appendChild(newCharInfoContainer)

		let menu = this.menus.render()
		menu.id = "nameEntryMenu"
		newCharBackground.appendChild(menu)
		return newCharBackground
	}
	handleInput(input){
		this.menus.handleInput(input)
	}
}