class Tile{
  	constructor(properties){
    	this.type = properties.type
    	this.collision = properties.collision
    	this.sprite = properties.sprite
		this.event = properties.event
  	}
	draw(context, x, y, tileSize) {
		const spriteImg = new Image()
		spriteImg.src = this.sprite.path
		spriteImg.addEventListener('load', () => {
		  context.drawImage(
			spriteImg,
			this.sprite.x,
			this.sprite.y,
			this.sprite.width,
			this.sprite.height,
			x * tileSize,
			y * tileSize,
			tileSize,
			tileSize
		  )
		})
	}
}
const tileDict = {
	greenTile: new Tile({
		sprite: {
		  path: "assets/testTileSprites.png",
		  position: {
			x: 111,
			y: 72
		  },
		  size: {
			width: 16,
			height: 16
		  }
		},
		event:false,
		collision:false
	  }),
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
		switch(input){
			case "arrowLeft":
				if(this.pointer>0){
					this.pointer--
				}
				break
			case "arrowRight":
				if(this.pointer<this.content.length-1){
					this.pointer++
				}
				break
			case "arrowUp":
				if(this.pointer-this.width>=0){
					this.pointer-=this.width
				}
				break
			case "arrowDown":
				if(this.pointer+this.width<this.content.length){
					this.pointer+=this.width
				}
				break
			case "A":
				this.content[this.pointer].action()
				break
			case "S":
				this.previous()
				break
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
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
				[tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile,tileDict.greenTile],
			],encounters:[
				
			],characters:[
				new Character({})
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
			{"main":new Menu(2,[{text:"New Game",action:state.newGame()},{text:"Load Game",action:state.loadSave()}],
			null)})
	}
	render(){
		let backgroundImg = document.createElement("div")
		backgroundImg.id = "titleScreenBackground"
		backgroundImg.style.backgroundImage = "assets/GoldTitle.png"

		let menu = this.menus[this.currentMenu].render()
		menu.id = "titleScreenMenu"
		
		backgroundImg.appendChild(menu)
		return backgroundImg
	}
	handleInput(input){
		this.menus.handleInput(input)
	}
}

class Overworld extends Scene{
  	constructor(player,map){
		super(player)
		this.characters = map.characters
		this.mapGrid = map.grid
		this.encounters = map.encounters
		this.menus = {
			"start": new Menu()
		}
		this.currentMenu = "none"
  	}
	render(){
		let sceneContainer = document.createElement("div")
		let backGroundLayer = document.createElement("canvas")
		backGroundLayer.id = "overworldBackgroundLayer"
		let BGctx = backGroundLayer.getContext("2d")
		for(let row = this.player.posX - 25; row < this.player.posX + 25; row++){
			for(let column = this.player.posY - 25; column < this.player.posY + 25; column++){
				if(row>0 || row<this.mapGrid.length || column>0 || column<this.mapGrid[row].length){
					BGctx.fillStyle = "black";
            		BGctx.fillRect((row - (this.player.posX - 25)) * 16, (column - (this.player.posY - 25)) * 16, 16, 16);
				}
				else{
					this.mapGrid[row][column].draw(BGctx, row, column, 16)
				}
			}
		}
		sceneContainer.appendChild(backGroundLayer)
		let foreGroundLayer = document.createElement("canvas")
		foreGroundLayer.id = "overworldForegroundLayer"
		let FGctx = foreGroundLayer.getContext("2d")
		this.characters.forEach(char => {
			if(char.posX>this.player.posX-25 && char.posX<this.player.posX+25 && char.posY>this.player.posY-25 && char.posY<this.player.posY+25){
				//TODO this
				FGctx.drawImage()
			}
		});
		sceneContainer.appendChild(foreGroundLayer)
		return sceneContainer
	}
}


class Battle extends Scene{
    constructor(options){
		super(options.player,{
			"main": new Menu(2,[
				{text:"Fight",action:() => this.createMenuInstance("fight",
				{previous:"main", 
				width:2, 
				content:this.player.pokemon[0].moves.map(move => {
					return {text:move.name, action:() => this.selectAction("move", move)}
				})})},
				{text:"Items",action:this.changeMenu("items")},
				{text:"PKMN",action:this.changeMenu("party")},
				{text:"Run",action:this.fleeBattle()}
			],this.changeMenu("main"))
		})
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
		level.textContent = `lv.${this.player.party[0].level}`

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
	selectAction(type, action){

	}
	handleBattleLogic(playerAction){

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
			{text:"end",action:()=>{state.initializeNewGame(this)}},
			{text:"<-",action:()=>{if(this.name.length<0){
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
			playerSprite.src = "placeholder"
		}
		else{
			playerSprite.src = "placeholder"
		}
		newCharInfoContainer.appendChild(playerSprite)
		let nameContainer =  document.createElement("div")
		nameContainer.id = "newCharNameContainer"
		for(let i = 0; i < 10; i++){
			let charSpan = document.createElement("span")
			if(this.name.length>i){
				charSpan.textContent = this.name[i]
			}
			else{
				charSpan.textContent = "_"
			}
			nameContainer.appendChild(charSpan)
		}
		
		newCharBackground.appendChild(newCharInfoContainer)

		let menu = this.menus.render()
		menu.id = "nameEntryMenu"
		newCharBackground.appendChild(menu)
		return newCharBackground
	}
}