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
		event:(map,scene)=>{
			if(Math.random()>0.90){
				scene.startWildEncounter(map.encounters[Math.floor(Math.random()*map.encounters.length)])
			}
		},
	  	collision:false,
		type:"none"
		}
	)
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
              {name:"bulbasaur",level:10,moves:["vine-whip","tackle","absorb","solar-beam"]},{name:"charizard",level:25,moves:["flamethrower","fly","solar-beam","aerial-ace"]}
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