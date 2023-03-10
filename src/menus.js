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