class Game {
    constructor() {
      	// Initialize game state
      	this.state = {
        	currentScene: null,
        	player: null,
			mapStates: null
      	};
    }
  
    start() {
		app.addEventListener("keydown",event =>{
			this.state.currentScene.handleInput(event)
		})
		
		const title = new TitleScreen(this);
		currentScene = title
  
      	// Start game loop
      	this.loop();
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
		app.appendChild(this.currentScene.render())
    }
	loadGame(){
		
	}
	newGame(){
		currentScene = new NewCharScreen(this)
	}
	initializeNewGame(properties){
		this.state.mapStates = new MapStateCollection()
		this.state.player = new Player({
			gender:properties.gender,
			name:properties.name
		})
	}
  }
  