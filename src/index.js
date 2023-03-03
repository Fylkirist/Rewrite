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
playerSprites.female.src = "../assets/femaleTestOverworldSprite.png"

const itemDict = {
	"potion":{
		"name": "Potion",
		"description": "Restores a Pokémon's HP by 20.",
		"action": function(pokemon) {
			if(pokemon.currentHP<pokemon.stats.hp){
		  		pokemon.currentHP += 20;
		  		if (pokemon.currentHP > pokemon.stats.hp) {
					pokemon.currentHP = pokemon.stats.hp;
		  		}
				return [true,`${pokemon.name}'s hp was restored by 20`]
			}
			else{
				return [false,`${pokemon.name} is already at full health`]
			}
		}
	},
	"pokeball":{
		"name": "Pokeball",
		"description": "A ball to catch pokemon",
		"action": function(player, target) {

		}
	},
	"repel":{}
}

async function createNewPokemon(name, level, moves){
  	let data = await P.getPokemonByName(name)
  	let speciesData = await P.getPokemonSpeciesByName(name)
	let pMoves = await P.getMoveByName(moves)
  	return new Pokemon(data, speciesData, level , pMoves)
}

let gameState = new Game()
gameState.start()
gameState.initializeEventListener()