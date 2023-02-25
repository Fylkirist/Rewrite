const app = document.getElementById("app")

const P = new Pokedex.Pokedex()

async function createNewPokemon(name, level, moves){
  	let data = await P.getPokemonByName(name)
  	let speciesData = await P.getPokemonSpeciesByName(name)
  	return new Pokemon(data, speciesData, level , moves)
}

let gameState = new Game()
gameState.start()
gameState.initializeEventListener()