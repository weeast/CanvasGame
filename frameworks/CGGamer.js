var cg = cg || {};

cg.gamer = {
	_globalFPS : 60,
	_gameDirector : null,

	init : function(canvas,size,position,FPS){
		cg.DRAW_CANVAS =  canvas ||'canvas';
		cg.winSize = size || cg.size(800,450);
		cg.winPosition = position || cg.p(0,0);
		this._globalFPS = FPS;
		this._gameDirector = new cg.Director(this._globalFPS);
		cg.director = this._gameDirector;
		cg.playerContorl.init();
	},

	run : function(node){
		if(!this._gameDirector){
			this._gameDirector = new cg.Director(this._globalFPS);
			cg.director = this._gameDirector;
		}
		this._gameDirector.runScene(node);
		this._gameDirector.run();
	}
};