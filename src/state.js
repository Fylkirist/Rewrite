const natures = {
  	Hardy: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 ,name:"Hardy"},
  	Lonely: { attack: 1.1, defense: 0.9, specialAttack: 1, specialDefense: 1, speed: 1 ,name:"Lonely"},
  	Brave: { attack: 1.1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 0.9 ,name:"Brave"},
  	Adamant: { attack: 1.1, defense: 1, specialAttack: 0.9, specialDefense: 1, speed: 1 ,name:"Adamant"},
  	Naughty: { attack: 1.1, defense: 1, specialAttack: 1, specialDefense: 0.9, speed: 1 ,name:"Naughty"},
  	Bold: { attack: 0.9, defense: 1.1, specialAttack: 1, specialDefense: 1, speed: 1 ,name:"Bold"},
  	Docile: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 ,name:"Docile"},
  	Relaxed: { attack: 1, defense: 1.1, specialAttack: 1, specialDefense: 1, speed: 0.9 ,name:"Relaxed"},
  	Impish: { attack: 1, defense: 1.1, specialAttack: 0.9, specialDefense: 1, speed: 1 ,name:"Impish"},
  	Lax: { attack: 1, defense: 1.1, specialAttack: 1, specialDefense: 0.9, speed: 1 ,name:"Lax"},
  	Timid: { attack: 0.9, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1.1 ,name:"Timid"},
  	Hasty: { attack: 1, defense: 0.9, specialAttack: 1, specialDefense: 1, speed: 1.1 ,name:"Hasty"},
  	Serious: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 ,name:"Serious"},
  	Jolly: { attack: 1, defense: 1, specialAttack: 0.9, specialDefense: 1, speed: 1.1 ,name:"Jolly"},
  	Naive: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 0.9, speed: 1.1 ,name:"Naive"},
  	Modest: { attack: 0.9, defense: 1, specialAttack: 1.1, specialDefense: 1, speed: 1 ,name:"Modest"},
  	Mild: { attack: 1, defense: 0.9, specialAttack: 1.1, specialDefense: 1, speed: 1 ,name:"Mild"},
  	Quiet: { attack: 1, defense: 1, specialAttack: 1.1, specialDefense: 1, speed: 0.9 ,name:"Quiet"},
  	Bashful: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 ,name:"Bashful"},
  	Rash: { attack: 1, defense: 0.9, specialAttack: 1.1, specialDefense: 1, speed: 1 ,name:"Rash"},
  	Calm: { attack: 0.9, defense: 1, specialAttack: 1, specialDefense: 1.1, speed: 1 ,name:"Calm"},
  	Gentle: { attack: 1, defense: 0.9, specialAttack: 1, specialDefense: 1.1, speed:1,name:"Gentle"},
  	Sassy:{ attack: 1, defense: 1, specialAttack: 1, specialDefense: 1.1, speed:0.9,name:"Sassy"},
  	Careful:{ attack: 1, defense: 1, specialAttack: 0.9, specialDefense: 1.1, speed:1,name:"Careful"},
  	Quirky: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 ,name:"Quirky"}
}

class Pokemon {
    constructor(data, speciesData, level, moves) {
        this.level = level;
    	this.name = data.name;
      	this.sprites = data.sprites;
      	this.id = data.id;
      	this.moves = moves
      	this.baseExperience = data.base_experience;
      	this.baseStats = (() => {
        	let emptyObj = {}
        	data.stats.forEach(element => {
          		emptyObj[element.stat.name]=element.base_stat
        	});
        	return emptyObj
      	})();
      	this.types = data.types.map(type => type.type.name);
		if(this.types.length<2){
			this.types.push("none")
		}
      	this.ability = data.abilities[Math.floor(Math.random()*data.abilities.length)]
      	this.experience = 0;
      	this.EVs = {
        	hp: 0,
        	attack: 0,
        	defense: 0,
        	specialAttack: 0,
        	specialDefense: 0,
        	speed: 0
      	}
      	this.IVs = {
        	hp: Math.floor(Math.random()*32),
        	attack: Math.floor(Math.random()*32),
        	defense: Math.floor(Math.random()*32),
        	specialAttack: Math.floor(Math.random()*32),
        	specialDefense: Math.floor(Math.random()*32),
        	speed: Math.floor(Math.random()*32)
      	};
      	this.nature = natures[Object.keys(natures)[Math.floor(Math.random() * Object.keys(natures).length)]];
      	this.stats = {
        	hp: Math.ceil((2*this.baseStats.hp+this.IVs.hp)*level/100+level+10),
        	attack: Math.ceil((((2*this.baseStats.attack+this.IVs.attack)*level/100)+5)*this.nature.attack),
        	defense: Math.ceil((((2*this.baseStats.defense+this.IVs.defense)*level/100)+5)*this.nature.defense),
        	specialAttack: Math.ceil((((2*this.baseStats["special-attack"]+this.IVs.specialAttack)*level/100)+5)*this.nature.specialAttack),
        	specialDefense: Math.ceil((((2*this.baseStats["special-defense"]+this.IVs.specialDefense)*level/100)+5)*this.nature.specialDefense),
        	speed: Math.ceil((((2*this.baseStats.speed+this.IVs.speed)*level/100)+5)*this.nature.speed)
      	}
      	this.speciesData = speciesData
		this.data = data
		this.currentHP = this.stats.hp
		this.gender = (() => {
			if (speciesData.gender_rate === -1){
			  return "Genderless";
			} 
			else{
			  const genderRatio = this.speciesData.gender_rate / 8;
			  const rand = Math.random();
			  if (rand <= genderRatio) {
				return "Female";
			  } 
				else{
				return "Male";
			  }
			}
		  })();
		this.growthRate = speciesData.growth_rate.name
		this.status = "none"
		this.statMod = {
			attack:1,
			defense:1,
			specialAttack:1,
			specialDefense:1,
			speed:1,
			avoid:1,
			accuracy:1
		}
		  
    }
	render(context){
		let pokeSprite = document.createElement("img")
		if(context=="facing"){
			pokeSprite.src = this.sprites.front_default
			return pokeSprite
		}
		else if(context=="away"){
			pokeSprite.src = this.sprites.back_default
			return pokeSprite
		}
	}
	
	learnMove(move){

	}

	forgetMove(move){

	}
}

class Character{
    constructor(options){
      	this.posX = options.posX
      	this.posY = options.posY
      	this.facing = options.facing
      	this.type = options.type
      	this.flags = options.flags
      	this.party = options.party
		this.sprite = options.sprite
		this.name = options.name
		this.reward = options.reward
		this.dialogue = options.dialogue
    }
	render(params){
		if(params.situation=="overworld"){
			params.context.drawImage(charSprites,this.sprite[this.facing].x,this.sprite[this.facing].y,16,21,params.x,params.y,16,21)
		}
		else if(params.situation=="battle"){

		}
	}
}

class Player extends Character{
    constructor(options){
		super({posX:options.posX, 
			posY:options.posY, 
			flags:options.flags, 
			party:options.party,
			facing:options.facing,
			sprite:{
				"female":{
					"south":{x:4,y:5},
					"north":{x:125,y:5},
					"west":{x:64,y:5},
					"east":{x:185,y:5}
				},
				"male":{
					"south":{x:6,y:7},
					"north":{x:127,y:7},
					"west":{x:66,y:7},
					"east":{x:187,y:7}
				}
			},
			name:options.name
		})
      	this.gender = options.gender
      	this.money = options.money
      	this.items = options.items
    }
	render(params){
		if(params.situation == "overworld"){
			params.context.drawImage(playerSprites[this.gender],this.sprite[this.gender][this.facing].x,this.sprite[this.gender][this.facing].y,18,21,199,195,18,21)
		}
	}
	useItem(item,target){
		
	}
	switchPKMN(i,t){
		let storage = this.party[i]
		this.party[i] = this.party[t]
		this.party[t] = storage
	}
}
