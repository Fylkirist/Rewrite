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
		const title = new TitleScreen(this);
		this.state.currentScene = title
 		 app.addEventListener("keydown",event =>{
			this.state.currentScene.handleInput(event)
		})
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
		app.appendChild(this.state.currentScene.render())
    }
	loadSave(){
		
	}
	newGame(){
		this.state.currentScene = new NewCharScreen(this)
	}
	initializeNewGame(properties){
		this.state.mapStates = new MapStateCollection()
		this.state.player = new Player({
			gender:properties.gender,
			name:properties.name
		})
	}
  }
  