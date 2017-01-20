var cg = cg || {};


/********************************************
 *                帧动画部分
 *******************************************/

cg.Animation = cg.Class.extend({
	_frames : [],
	_interval : 0.0,
	_loader : null,
	_lastTick : 0.0,
	_node : null,
	_index : 0,
	_finished : false,
	_finishCall : null,

	ctor : function(frames, interval){
		this._loader = new cg.Loader();
		this._frames = [];
		this._interval = interval;
		this._loadFrames(frames);
	},

	_loadFrames : function(frames){
		if(cg.isArray(frames)){
			for(var i=0,len=frames.length;i<len;++i){
				var rid = this._loader.loadImg(frames[i]);
				this._frames.push(cg.resourcesManager._getImgResource(rid));
			}
		}
	},

	_setNode : function(node){
		if(!node instanceof cg.Node)
			return
		this._node = node;
	},

	_getNode : function(){
		return this._node;
	},

	_setCallBack : function(callfn){
		this._finishCall = callfn;
	},

	step : function(dt){
		var locNode = this._node;
		this._lastTick += dt;
		if(this._lastTick>this._interval && !this._finished && locNode){
			locNode.setTexture(this._frames[this._index].resource);
			this._index++;
			if(this._index == this._frames.length){
				this._finished = true;
				if(cg.isFunction(this._finishCall))
					this._finishCall.call(this);
			}
			this._lastTick = 0.0;
		}
	}
});