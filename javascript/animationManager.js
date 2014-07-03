function AnimationManager(param, context){

	this.objectsTab = undefined;
	this.fpsCount = 0;
	this.frameX1=0;
	this.frameX2=0;
	this.speed = 10; //vitesse d'animation du personnage

	this.updateObjects = function(){
		this.objectsTab = param.objectDrawTab;
	}

	this.displayImagesLoop = function(){
		for(var i=0; i < this.objectsTab.length; i++) {
			
			var currentInTab = this.objectsTab[i];
			var currentBody = currentInTab.GetBody();
			var currentBodyPosition = currentBody.GetPosition();
			var currentBodyUserData = currentInTab.GetUserData();

			if(currentInTab.m_userData != "player") {
				context.save();
				context.translate(currentBodyPosition.x * 30, currentBodyPosition.y * 30);
				context.rotate(currentBody.GetAngle());
					
					var dataResize = { 'image'    : currentBodyUserData.img,
									   'imgPosX'  : currentBodyPosition.x,
									   'imgPosY'  : currentBodyPosition.y,
									   'imgWidth' : currentInTab.m_shape.m_vertices[2].x*60,
									   'imgHeight': currentInTab.m_shape.m_vertices[2].y*60
					};

					context.drawImage(
								dataResize.image, 
								-dataResize.imgWidth/2, //img pos x
								-dataResize.imgHeight/2, //img pos y
								dataResize.imgWidth, //img wdith
								dataResize.imgHeight //img height
							);
				context.restore();
			}
		}
	}

	this.displayAnimationsLoop = function(){
		this.fpsCount++; //compteur de fps pour régler la vitesse des animations

		for (var i = 0; i < this.objectsTab.length; i++) {

			var currentInTab = this.objectsTab[i]; //issu d'une methode qui update en permanence la liste des objets du jeu
			var currentBody = currentInTab.GetBody(); 
			var currentBodyPosition = currentBody.GetPosition();
			var currentBodyUserData = currentInTab.GetUserData();
			var currentImage = "";
			var currentBodyAnimate = currentBodyUserData.animate;
			
			context.save();
			context.translate(currentBodyPosition.x * 30, currentBodyPosition.y * 30);
			context.rotate(currentBody.GetAngle());

			if(typeof currentBodyAnimate!='undefined'){
				var imageNbr = 0;
				//Animation personnage
				if (currentBodyUserData.nature === 'player') {
					var radius = currentInTab.m_shape.m_radius* 60;
					if(game.playerWalking === true){ //personnage marche
						currentImage = currentBodyUserData.img2;
						imageNbr = currentBodyAnimate.sprites.walking.imageNbr;
						if(this.fpsCount % this.speed===0){
							this.frameX1+=currentBodyAnimate.stepPx; //on update la position de la frame d'animation sur la spritesheet
						}
					} else{ //personnage idle
						currentImage = currentBodyUserData.img1;
						imageNbr = currentBodyAnimate.sprites.idle.imageNbr;
					
					}

					context.drawImage(
								currentImage, 
								this.frameX1, //position en X de la frame
								0, 
								currentBodyAnimate.stepPx,//framewidth
								currentBodyAnimate.stepPx+26,//frameheight
								-radius/2, //img pos x
								-radius/2-16, //img pos y
								radius, //img wdith
								radius+16 //img height
					);
					if(this.frameX1 >=(imageNbr*currentBodyAnimate.stepPx)) {

						this.frameX1=0;
					}
					
				} else if (currentBodyUserData.nature === 'decor'){
					var imageNbr = currentBodyAnimate.imageNbr;
					if(this.fpsCount % this.speed===0){
						if (currentBodyAnimate.special === true) {
							this.frameX2+=5;

						}else{
							this.frameX2+=currentBodyAnimate.stepPx; //on update la position de la frame d'animation sur la spritesheet
						}
					}
					if(this.frameX2 >=(imageNbr*currentBodyAnimate.stepPx)) {
						this.frameX2=0;
					}
					var dataResize = { 'image': currentBodyUserData.img,
								  	'imgPosX' : currentBodyPosition.x,
								   'imgPosY'  : currentBodyPosition.y,
								   'imgWidth' : currentInTab.m_shape.m_vertices[2].x*60,
								   'imgHeight': currentInTab.m_shape.m_vertices[2].y*60
					};
					context.drawImage(
								dataResize.image,
								this.frameX2,
								0,
								currentBodyAnimate.stepPx,//framewidth
								currentBodyAnimate.stepPx,//frameheight
								-dataResize.imgWidth/2, //img pos x
								-dataResize.imgHeight/2, //img pos y
								dataResize.imgWidth, //img wdith
								dataResize.imgHeight //img height
					);		
				}
			}
			context.restore();
		}
	}
}

	// On lui passe:

	// * Soit un array d'objets qui contiennent chacun:
	//   - les positions de chaque image dans la spreadsheet
	//   - les taille de chaque image dans la spreadsheet
	//   - nombre d'image dans la spreadsheet
	//   - chemin de la spreadsheet
	//   - la vitesse a laquelle il faut animer

