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
		switch(input.key){
			case "ArrowLeft":
				if(this.pointer>0){
					this.pointer--
				}
				break
			case "ArrowRight":
				if(this.pointer<this.content.length-1){
					this.pointer++
				}
				break
			case "ArrowUp":
				if(this.pointer-this.width>=0){
					this.pointer-=this.width
				}
				break
			case "ArrowDown":
				if(this.pointer+this.width<this.content.length){
					this.pointer+=this.width
				}
				break
			case "a":
				this.content[this.pointer].action()
				break
			case "s":
				this.previous()
				break
		}
	}
}

class ItemMenu extends Menu{
	constructor(content,previous,action1,action2){
		super(1,content,previous)
		this.subMenu = false
		this.action1 = action1
		this.action2 = action2
	}
	render(){
		let menuContainer = document.createElement("div")
		menuContainer.id = "itemMenuContainer"

		let itemSpriteContainer = document.createElement("canvas")
		itemSpriteContainer.id = "itemMenuSprite"
		itemSpriteContainer.width = 50
		itemSpriteContainer.height = 50

		let itemList = document.createElement("div")
		itemList.id = "itemMenuListContainer"

		let ctx = itemSpriteContainer.getContext("2d")
		ctx.drawImage(itemSpriteSheet,this.content[this.pointer].sprite.x,this.content[this.pointer].sprite.y,29,32,0,0,50,50)

		if(this.subMenu){
			menuContainer.appendChild(this.subMenu.render())
		}
		
		for(let i = 0; i<this.content.length; i++){
			let menuElement = document.createElement("div")
			menuElement.className = "itemMenuElement"

			let itemLabel = document.createElement("label")
			itemLabel.textContent = this.content[i].name
			itemLabel.className = "itemMenuItemLabel"

			let itemQuantity = document.createElement("label")
			itemQuantity.textContent = "x" + this.content[i].quantity
			itemQuantity.className = "itemMenuItemQuantity"

			if(i == this.pointer){
				menuElement.classList.add("itemSelectedMenuElement")
			}
			menuElement.appendChild(itemLabel)
			menuElement.appendChild(itemQuantity)
			itemList.appendChild(menuElement)
		}
		menuContainer.appendChild(itemList)
		menuContainer.appendChild(itemSpriteContainer)
		return menuContainer
	}
	handleInput(input){
		if(this.subMenu!=false){
			this.subMenu.handleInput(input)
		}
		else{
			switch(input.key){
				case "ArrowLeft":
					if(this.pointer>0){
						this.pointer--
					}
					break
				case "ArrowRight":
					if(this.pointer<this.content.length-1){
						this.pointer++
					}
					break
				case "ArrowUp":
					if(this.pointer-this.width>=0){
						this.pointer-=this.width
					}
					break
				case "ArrowDown":
					if(this.pointer+this.width<this.content.length){
						this.pointer+=this.width
					}
					break
				case "a":
					this.subMenu = new Menu(1,[{text:"Use",action:()=>this.action1(this.pointer)},{text:"Drop",action:()=>this.action2(this.pointer)}],(()=>{this.subMenu = false}))
					break
				case "s":
					this.previous()
					break
			}
		}
	}
}

class FullScreenMenu extends Menu{
	constructor(width, content, previous){
		super(width,content,previous)
		
		this.subMenu = false
	}
	render(){
		let menuContainer = document.createElement("div")
		menuContainer.className = "overworldPartyMenuContainer"
		
		for(let i = 0; i < this.content.length; i++){
			let menuElem = document.createElement("div")
			menuElem.className="overworldPartyMenuElement"
			if(this.pointer === i){
				menuElem.classList.add("overworldPartySelectedElem")
			}

			let elemPic = document.createElement("img")
			elemPic.className = "overworldPartyMenuPic"
			elemPic.src = this.content[i].sprites.front_default

			let elemName = document.createElement("label")
			elemName.className = "overworldPartyMenuName"
			elemName.textContent = this.content[i].name

			let elemLevel = document.createElement("label")
			elemLevel.className = "overworldPartyMenuLevel"
			elemLevel.textContent = `lvl. ${this.content[i].level}`

			let elemHealthLabel = document.createElement("label")
			elemHealthLabel.className = "overworldPartyMenuHealthLabel"
			elemHealthLabel.textContent = `${this.content[i].currentHP}/${this.content[i].stats.hp}`

			let elemHealthBarParent = document.createElement("div")
			elemHealthBarParent.className = "overworldPartyMenuHealthBarParent"

			let elemHealthBarChild = document.createElement("div")
			elemHealthBarChild.className = "overworldPartyMenuHealthBarChild"
			elemHealthBarChild.style.width = `${this.content[i].currentHP/this.content[i].stats.hp*100}%`
			elemHealthBarParent.appendChild(elemHealthBarChild)

			menuElem.appendChild(elemPic)
			menuElem.appendChild(elemName)
			menuElem.appendChild(elemLevel)
			menuElem.appendChild(elemHealthLabel)
			menuElem.appendChild(elemHealthBarParent)

			menuContainer.appendChild(menuElem)
		}
		if(this.subMenu){
				let subMenuElem = this.subMenu.render()
				menuContainer.appendChild(subMenuElem)
			}
		return menuContainer
	}
	handleInput(input){
		if(this.subMenu){
			this.subMenu.handleInput(input)
		}
		else{
			switch(input.key){
				case "ArrowLeft":
					if(this.pointer>0){
						this.pointer--
					}
					break
				case "ArrowRight":
					if(this.pointer<this.content.length-1){
						this.pointer++
					}
					break
				case "ArrowUp":
					if(this.pointer-this.width>=0){
						this.pointer-=this.width
					}
					break
				case "ArrowDown":
					if(this.pointer+this.width<this.content.length){
						this.pointer+=this.width
					}
					break
				case "a":
					this.subMenu = new Menu(1,[{text:"Switch",action:()=>this.content[this.pointer].action1(this.pointer)},{text:"Summary",action:()=>this.content[this.pointer].action2(this.pointer)}],(()=>{this.subMenu = false}))
					break
				case "s":
					this.previous()
					break
			}	
		}
	}
}

class Dialogue{
	constructor(content){
		this.content = content
		this.pointer = 0
	}
	render(){
		let dialogueWindow = document.createElement("div")
		dialogueWindow.className = "NPCDialogueWindowContainer"

		let dialogueText = document.createElement("div")
		dialogueText.className = "NPCDialogueText"
		dialogueText.textContent = `${this.content[this.pointer].text}`

		dialogueWindow.appendChild(dialogueText)

		if(this.content[this.pointer].menu){
			let dialogueMenu = this.content[this.pointer].menu.render()
			dialogueMenu.id = "overworldDialogueMenu"
			dialogueWindow.appendChild(dialogueMenu)
		}
		return dialogueWindow
	}
	handleInput(input){
		if(this.content[this.pointer].menu){
			this.content[this.pointer].menu.action(input)
		}
		
	}
}

class SummaryView extends Menu{
	constructor(previous, content, selected){
		super(4,content,previous)
		this.pPointer = selected
	}
	render(){
		let container = document.createElement("div")

		let leftContainer = document.createElement("div")
		leftContainer.id = "summaryViewLeftContainer"

		let spriteContainer = this.content[this.pPointer].render("facing")
		spriteContainer.id = "summaryViewSprite"
		leftContainer.appendChild(spriteContainer)

		let levelLabel = document.createElement("label")
		levelLabel.textContent = "lvl. " + this.content[this.pPointer].level
		levelLabel.id = "summaryViewLevelLabel"
		leftContainer.appendChild(levelLabel)

		let genderLabel = document.createElement("label")
		genderLabel.id = "summaryViewGender"
		if(this.content[this.pPointer].gender == "Male"){
			genderLabel.textContent = "♂"
			genderLabel.style.color = "blue"
		}
		else if(this.content[this.pPointer].gender == "Female"){
			genderLabel.textContent = "♀"
			genderLabel.style.color = "pink"
		}

		leftContainer.appendChild(genderLabel)
		container.appendChild(leftContainer)

		let menuIndicatorContainer = document.createElement("div")
		menuIndicatorContainer.id = "summaryMenuIndicatorContainer"

		let elem1 = document.createElement("div")
		elem1.textContent = "PKMN"
		elem1.className = "summaryMenuIndicator"

		let elem2 = document.createElement("div")
		elem2.textContent = "Stats"
		elem2.className = "summaryMenuIndicator"

		let elem3 = document.createElement("div")
		elem3.textContent = "Moves"
		elem3.className = "summaryMenuIndicator"

		let elem4 = document.createElement("div")
		elem4.textContent = "Description"
		elem4.className = "summaryMenuIndicator"

		menuIndicatorContainer.appendChild(elem1)
		menuIndicatorContainer.appendChild(elem2)
		menuIndicatorContainer.appendChild(elem3)
		menuIndicatorContainer.appendChild(elem4)

		container.appendChild(menuIndicatorContainer)

		let summaryContainer = document.createElement("div")
		summaryContainer.id = "summaryViewInfoContainer"

		switch(this.pointer){
			case 0:
				let typesContainer = document.createElement("div")
				typesContainer.id = "summaryViewTypeContainer"

				let typeTitle = document.createElement("div")
				typeTitle.id = "summaryViewTypeTitle"
				typeTitle.textContent ="Types:"

				typesContainer.appendChild(typeTitle)

				let type1 = document.createElement("label")
				type1.id = "summaryViewType1"
				type1.textContent = this.content[this.pPointer].types[0]
				typesContainer.appendChild(type1)
				
				if(this.content[this.pPointer].types[1]!="none"){
					let type2 = document.createElement("label")
					type2.textContent = this.content[this.pPointer].types[1]
					type2.id = "summaryViewType2"
					typesContainer.appendChild(type2)
				}

				let abilityTitle = document.createElement("div")
				abilityTitle.id = "summaryViewAbilityTitle"
				abilityTitle.textContent = "Ability:"

				let abilityContainer = document.createElement("div")
				abilityContainer.id = "summaryViewAbilityContainer"
				abilityContainer.textContent = this.content[this.pPointer].ability.ability.name

				let natureTitle = document.createElement("div")
				natureTitle.id = "summaryViewNatureTitle"
				natureTitle.textContent = "Nature:"

				let natureContainer = document.createElement("div")
				natureContainer.id = "summaryViewNatureContainer"
				natureContainer.textContent = this.content[this.pPointer].nature.name

				summaryContainer.appendChild(typesContainer)
				summaryContainer.appendChild(abilityTitle)
				summaryContainer.appendChild(abilityContainer)
				summaryContainer.appendChild(natureTitle)
				summaryContainer.appendChild(natureContainer)

				elem1.classList.add("summaryMenuSelectedIndicator")
				break

			case 1:
				let summaryStatsTitle = document.createElement("div")
				summaryStatsTitle.textContent = "Stats"
				summaryStatsTitle.id = "summaryViewStatTitle"

				summaryContainer.appendChild(summaryStatsTitle)
				
				let statsContainer = document.createElement("div")
				statsContainer.id = "summaryViewStatContainer"

				let hpElem = document.createElement("div")
				hpElem.textContent = "hp: " + this.content[this.pPointer].stats.hp
				hpElem.id = "summaryViewHp"

				let	attackElem = document.createElement("div")
				attackElem.textContent = "att: " + this.content[this.pPointer].stats.attack
				attackElem.id = "summaryViewAttack"

				let spAttackElem = document.createElement("div")
				spAttackElem.textContent = "sp.att: " + this.content[this.pPointer].stats.specialAttack
				spAttackElem.id = "summaryViewSpecialAttack"

				let defenseElem = document.createElement("div")
				defenseElem.textContent = "def: " + this.content[this.pPointer].stats.defense
				defenseElem.id = "summaryViewDefense"

				let spDefenseElem = document.createElement("div")
				spDefenseElem.textContent = "sp.def: " + this.content[this.pPointer].stats.specialDefense
				spDefenseElem.id = "summaryViewSpecialDefense"

				let speedElem = document.createElement("div")
				speedElem.textContent = "speed: " + this.content[this.pPointer].stats.speed
				speedElem.id = "summaryViewSpeed"

				statsContainer.appendChild(hpElem)
				statsContainer.appendChild(attackElem)
				statsContainer.appendChild(spAttackElem)
				statsContainer.appendChild(defenseElem)
				statsContainer.appendChild(spDefenseElem)
				statsContainer.appendChild(speedElem)

				summaryContainer.appendChild(statsContainer)

				elem2.classList.add("summaryMenuSelectedIndicator")
				break

			case 2:
				let titleContainer = document.createElement("div")
				titleContainer.id = "summaryViewTitle"
				titleContainer.textContent = "Moves"

				let moveContainer = document.createElement("div")
				moveContainer.id = "summaryViewMoveContainer"
				
				for(let i = 0; i<this.content[this.pPointer].moves.length; i++){
					let moveElem = document.createElement("div")
					moveElem.className = "summaryViewMoveElement"

					let moveTypeLabel = document.createElement("label")
					moveTypeLabel.textContent = this.content[this.pPointer].moves[i].type.name
					moveTypeLabel.className = "summaryViewMoveType"

					let moveNameLabel = document.createElement("label")
					moveNameLabel.textContent = this.content[this.pPointer].moves[i].name
					moveNameLabel.className = "summaryViewMoveName"

					let movePPLabel = document.createElement("label")
					movePPLabel.textContent = this.content[this.pPointer].moves[i].pp
					movePPLabel.className = "summaryViewMovePP"

					moveElem.appendChild(moveTypeLabel)
					moveElem.appendChild(moveNameLabel)
					moveElem.appendChild(movePPLabel)

					moveContainer.appendChild(moveElem)
				}
				
				summaryContainer.appendChild(titleContainer)
				summaryContainer.appendChild(moveContainer)

				elem3.classList.add("summaryMenuSelectedIndicator")
				break

			case 3:
				let descriptionTitleContainer = document.createElement("div")
				descriptionTitleContainer.id = "summaryViewDescriptionTitle"
				descriptionTitleContainer.textContent = "Species description"

				let descriptionBox = document.createElement("div")
				descriptionBox.id = "summaryViewDecriptionContainer"

				let descriptionHeader = document.createElement("h4")
				descriptionHeader.id = "summaryViewDescriptionHeader"
				descriptionHeader.textContent = this.content[this.pPointer].name

				let description = document.createElement("p")
				description.id = "summaryViewDescription"
				description.textContent = this.content[this.pPointer].speciesData.flavor_text_entries[0].flavor_text

				descriptionBox.appendChild(descriptionHeader)
				descriptionBox.appendChild(description)

				summaryContainer.appendChild(descriptionBox)
				elem4.classList.add("summaryMenuSelectedIndicator")
				break
		}
		container.appendChild(summaryContainer)
		return container
	}
	handleInput(input){
		switch(input.key){
			case "ArrowLeft":
				if(this.pointer>0){
					this.pointer--
				}
				break
			case "ArrowRight":
				if(this.pointer<3){
					this.pointer++
				}
				break
			case "ArrowUp":
				if(this.pPointer>0){
					this.pPointer--
				}
				break
			case "ArrowDown":
				if(this.pPointer+1<this.content.length){
					this.pPointer++
				}
				break
			case "s":
			case "S":
				this.previous()
				break
		}
	}
}