class Game {
    constructor() {
      	// Initialize game state
      	this.state = {
        	currentScene: null,
        	player: null,
			mapStates: null,
			currentMap: 0
      	};
		this.saveSlot = window.localStorage.getItem("PKMN-SAVED-STATE")
		this.runFlag = 1
		this.animQueue = []
		this.cachedScene;
		this.inputBuffer;
    }
  
    start() {
		const title = new TitleScreen(this);
		this.state.currentScene = title
      	// Start game loop
      	this.loop();
    }
	initializeEventListener(){
		document.addEventListener("keydown",(event) =>{
			console.log(event)
			this.inputBuffer = event
		})
	}
  
    loop() {
		if(this.runFlag==1){

			
			if(this.inputBuffer){
				this.state.currentScene.handleInput(this.inputBuffer)
			}
			this.inputBuffer = false
			this.render();
			
			
			requestAnimationFrame(this.loop.bind(this))
		}
    }

    render(){
      	app.innerHTML=""
		app.appendChild(this.state.currentScene.render())
    }
	loadSave(){
		let loadedState = this.saveSlot
		loadedState = JSON.parse(loadedState)
		this.state.currentScene = loadedState.currentScene
		this.state.mapStates =	loadedState.mapStates
		this.state.player = loadedState.player
	}
	saveGame(){
		let saveState = this.state
		this.saveSlot = saveState
		window.localStorage.setItem("PKMN-SAVED-STATE",JSON.stringify(saveState))
	}
	newGame(){
		this.state.currentScene = new NewCharScreen(this)
	}
	loadInitialMapStates(){
		
	}
	async initializeNewGame(properties){
		this.state.mapStates = new MapStateCollection()
		this.state.player = new Player({
			gender:properties.gender,
			name:properties.name,
			party:[await createNewPokemon("umbreon",20,["bite","growl","confuse-ray","quick-attack"])],
			posY:0,
			posX:0,
			flags:{},
			facing:"south",
			reward:0,
			money:0,
			items:[{name:"Potion",sprite:{x:100,y:100},quantity:99}]
		})
		this.state.currentScene = new Overworld(this.state.player,this.state.mapStates.mapStates[this.state.currentMap],this)
	}
 	async startBattle(type,opponent){
		if(type == "trainer"){
			let battleState = new Battle({
				encounterType:"trainer",
				enemy: opponent,
				player: this.state.player,
				state:this
			})
			this.cachedScene = this.state.currentScene
			this.state.currentScene = battleState
		}
		else{
			let battleState = new Battle({
				encounterType:"wild",
				enemy: {party:[await createNewPokemon(opponent.name,opponent.level,opponent.moves)], behaviour:"wild"},
				player:this.state.player,
				state:this
			})
			this.cachedScene = this.state.currentScene
			this.state.currentScene = battleState
		}
	}
	backToOverworld(){
		this.state.currentScene = this.cachedScene
	}
  }
  