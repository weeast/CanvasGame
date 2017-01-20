var cg = cg || {};


/********************************************
 *                渲染器
 *******************************************/
cg.Render = cg.Class.extend({
	_winSize : null,
	_cashedCanvas : null,
	_cashedContext : null,
	_drawCanvas : null,
	_drawContext : null,
	img : new Image(),

	ctor : function(winSize){
		this.img.src = './res/CloseNormal.png';
		this._cashedCanvas = document.createElement("canvas");
		this._winSize = winSize;
		if(winSize.width && winSize.height){
			this._cashedCanvas.setAttribute('width',winSize.width+'');
			this._cashedCanvas.setAttribute('height',winSize.height+'');
		}
		this._cashedContext = this._cashedCanvas.getContext("2d");
		cg._renderContext = this._cashedContext;
		this._drawCanvas = document.getElementById(cg.DRAW_CANVAS);
		if(!this._drawCanvas){
			cg.log(cg._LogInfos.RenderConstructor);
			return
		}
		this._drawContext = this._drawCanvas.getContext("2d");
	},

	draw : function(rootNode){
		if(!(rootNode instanceof cg.Node)){
			cg.director.stop();
			return
		}
		this._resetCanvas();
		var locW = this._winSize.width, locH = this._winSize.height;

		rootNode.visit(this._cashedContext);
		/*if(this.img.complete){
			this._cashedContext.drawImage(this.img,0,0);
		}*/
		this._drawContext.drawImage(this._cashedCanvas,0,0,locW,locH,0,0,locW,locH);
		
	},

	_resetCanvas : function(){
		this._cashedContext.clearRect(0,0,this._winSize.width,this._winSize.height);
		this._drawContext.clearRect(0,0,this._winSize.width,this._winSize.height);
	}

});
