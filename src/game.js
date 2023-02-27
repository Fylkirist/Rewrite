class Game {
    constructor() {
      	// Initialize game state
      	this.state = {
        	currentScene: null,
        	player: null,
			mapStates: null
      	};
		this.saveSlot = window.localStorage.getItem("PKMN-SAVED-STATE")
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
			this.state.currentScene.handleInput(event)
		})
	}
  
    loop() {
  

      	this.render();
  
      	// Repeat loop
      	requestAnimationFrame(this.loop.bind(this));
    }
  
    updateState() {
      	
    }
  
    render() {
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
		window.localStorage.setItem("PKMN-SAVED-STATE",JSON.stringify(saveState))
	}
	newGame(){
		this.state.currentScene = new NewCharScreen(this)
	}
	loadInitialMapStates(){
		
	}
	initializeNewGame(properties){
		this.state.mapStates = new MapStateCollection()
		this.state.player = new Player({
			gender:properties.gender,
			name:properties.name,
			party:[],
			posY:0,
			posX:0,
			flags:{},
			facing:"south",
			sprite:{},
			reward:0
		})
	}
  }
  