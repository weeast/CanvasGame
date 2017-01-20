var cg = cg || {};


/********************************************
 *                动作部分
 *******************************************/
cg.ACTION_TAG_INVALID = -1;
cg.Action = cg.Class.extend({
	_target : null,
	_node : null,
	_duration : 0.0,
	_enabled : false,
	_paused : false,
	_finished : false,
	_startPosition : null,
	_finishCallBack : null,

	ctor : function(duration, target, callfn){
		var _t = this;
		_t._enabled = true;
		_t._duration = duration;
		_t._target = target;
		if(callfn)
			_t._finishCallBack = callfn;
	},

	getTarget : function(){
		return this._target;
	},

	setTarget : function(target){
		if(!cg.isNumber(target)){
			cg.log(cg._LogInfos.ActionSetTarget);
			return;
		}
		this._target = target || cg.ACTION_TAG_INVALID;
		
	},

	getNode : function(){
		return this._node;
	},

	setNode : function(node){
		if(!node instanceof cg.Node){
			cg.log(cg._LogInfos.ActionSetNode);
			return;
		}
		this._node = node;
		this._startPosition = node.getPosition();
	},

	getDuration : function(){
		return this._duration;
	},

	setDuration : function(duration){
		if(!cg.isNumber(duration))
			return
		this._duration = duration;
	},

	isEnabled : function(){
		return this._enabled;
	},

	setEnabled : function(bool){
		if(!bool instanceof Boolean)
			return
		this._enabled = bool;
	},

	isPaused : function(){
		return this._paused;
	},

	setPaused : function(bool){
		if(!bool instanceof Boolean)
			return
		this._paused = bool;
	},

	isFinished : function(){
		return this._finished;
	},

	setFinished : function(bool){
		if(!bool instanceof Boolean)
			return
		this._finished = bool;
	},

	setCallback : function(callfn){
		if(!cg.isFunction(callfn))
			return
		this._finishCallBack = callfn;
	},

	_callFinishFunc : function(target){
		if(this._finishCallBack)
			this._finishCallBack.call(target);
	}
});

cg.MoveTo = cg.Action.extend({
	_destination: null,
	_firstTick : false,
	_elapsed: 0.0,
	_dx : 0.0,
	_dy : 0.0,

	ctor: function(duration, destination, callfn, target) {
		var _t = this;
		cg.Action.prototype.ctor.call(this, duration, callfn, target);
		_t._destination = destination;
		_t._firstTick = true;
	},

	step: function(dt) {
		var locNode = this.getNode(),startPosition = this._startPosition;
		if(!locNode){
			cg.log(cg._LogInfos.ActionMoveToUpdate);
			return;
		}
		if(this._firstTick){
			this._dx = this._destination.x - startPosition.x;
			this._dy = this._destination.y - startPosition.y;
			this._firstTick = false;
		}
		if(this.isEnabled() && !this.isPaused() && !this.isFinished()){
			this._elapsed += dt;
			var t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
			t = (1 > t ? t : 1);
			this.update(t > 0 ? t : 0);
		}
	},

	update : function(dt){
		var locNode =  this.getNode();
		if(this._startPosition && locNode){			
			locNode.setPosition(cg.p(this._dx*dt+this._startPosition.x,this._dy*dt+this._startPosition.y));
			if(dt == 1){
				this.setFinished(true);
				this._callFinishFunc();
			}
		}
	}
});

cg.MoveTo.create = function(duration, destination, callfn, target){
	return new cg.MoveTo(duration, destination, callfn, target);
}