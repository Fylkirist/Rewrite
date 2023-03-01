const app = document.getElementById("app")

const P = new Pokedex.Pokedex()

const tileSheet = new Image()
tileSheet.src = "../assets/testTileSprites.png"

const charSprites = new Image()
charSprites.src = "../assets/testCharSprites.png"

const playerSprites = {
	"male":new Image(),
	"female":new Image()
}

playerSprites.male.src = "../assets/maleTestOverworldSprite.png"
playerSprites.female.src = "../assets/femaleTestOverworldSprite.gif"

async function createNewPokemon(name, level, moves){
  	let data = await P.getPokemonByName(name)
  	let speciesData = await P.getPokemonSpeciesByName(name)
  	return new Pokemon(data, speciesData, level , moves)
}

let gameState = new Game()
gameState.start()
gameState.initializeEventListener()