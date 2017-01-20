var cg = cg || {};
/********************************************
 *                游戏导演部分
 *******************************************/
cg.timeInfo = cg.Class.extend({
	_firstTick : true,
	_oldTime : 0.0,
	_paused : true,
	_interCount : 0,
	_totalFPS : 0,
	
	/*
	函数名：getInfo
	描述：计算上次调用之后所用的时间、FPS、时间延迟等，得到的信息来保证游戏FPS看起来一致；
	参数：无；
	返回：Object*/
	getInfo : function(){
		if(this._firstTick === true){
			this._firstTick = false;
			this._paused = false;
			this._oldTime = +new Date();//时间的毫秒级 值
			return{
				elapsed : 0,
				FPS : 0,
				averageFPS : 0,
				totalFPS : this._totalFPS
			};
		}

		
		var newTime = +new Date();	
		var elapsed = newTime - this._oldTime;//上一次调用后使用的时间
		this._oldTime = newTime;
		var FPS = 1000 / elapsed;//实际帧率
		this._interCount++;
		this._totalFPS += FPS;
		if(this._paused)
			return {
				elapsed : 0,
				FPS : FPS,
				averageFPS : this._totalFPS / this._interCount,
				totalFPS : this._totalFPS
			}
		return{
			elapsed : elapsed,
			FPS : FPS,
			averageFPS : this._totalFPS / this._interCount,
			totalFPS : this._totalFPS
		}
	},
	
	/*
	函数名：pause
	描述：暂停计数，即设置暂停标签，游戏中所有暂停都应调用该方法；
	参数：无；
	返回：无；*/
	pause : function(){
		this._paused = true;
	},

	resume : function(){
		this._paused = false;
	}
});
//director
cg.Director =  cg.Class.extend({
	_firstTick : true,
	_timer : null,
	_timeInfo : null,
	_currentSence : null,
	_globalFPS : 0,
	_eventStack : [],
	_stoped : true,
	_paused : true,
	_render : null,
	_scheduler : null,
	_actionManager : null,
	_eventManager : null,
	_animationManager : null,
	_eventBeforeUpate : null,
	_eventAfterUpate: null,
	_eventAfterDraw: null,

	ctor : function(globalFPS){
		this._globalFPS = globalFPS;
		this._timer = new cg.timeInfo();
		this._render = new cg.Render(cg.winSize);
		this._scheduler = new cg.Scheduler();
		this._actionManager = cg.actionManager;
		this._animationManager = cg.animateManager;
		this._eventManager = cg.eventManager;
		this._eventManager.setEnabled(true);
		this._eventBeforeUpate = new cg.Event(cg.Event.BEFORE_UPATE);
		this._eventAfterUpate = new cg.Event(cg.Event.AFTER_UPATE);
		this._eventAfterDraw = new cg.Event(cg.Event.AFTER_DRAW);

	},

	getRunningScene : function(){
		return this._currentSence;
	},

	getWinSize : function(){
		return cg.winSize;
	},

	getActionManager : function(){
		return this._actionManager;
	},

	getAnimationManager : function(){
		return this._animationManager;
	},

	getEventManager : function(){
		return this._eventManager;
	},

	getScheduler : function(){
		return this._scheduler;
	},

	//游戏主循环函数
	update : function() {
		var _t = this, timeInfo = _t._timeInfo,durationTime;
		durationTime = timeInfo.elapsed;
		_t._eventManager.dispatchEvent(_t._eventBeforeUpate);
		_t._animationManager.update(durationTime/1000);
		_t._actionManager.update(durationTime/1000);
		_t._scheduler.update(durationTime/1000);
		_t._eventManager.dispatchEvent(_t._eventAfterUpate);
		_t._render.draw(this._currentSence);
		_t._eventManager.dispatchEvent(_t._eventAfterDraw);
		/*  首先计算这帧到下帧的时间
			通过事件管理器通知BEFORE_UPATE事件
			更新各子系统(包含了事件处理)
			帧动画子系统
			物理子系统（i.碰撞系统）
			通过事件管理器通知AFTER_UPATE事件
			清空画布
			如果需要进行场景切换
			通知渲染子系统进行绘制
			通过事件管理器通知AFTER_DRAW事件
			增加全局总帧数
			*/
		/**
		 * TODO
		 */
	},
	setFPS : function(FPS){
		this._globalFPS = FPS;
	},
	runScene : function(rootNode){
		this._scheduler.unscheduleAllCallbacks();
		this._animationManager.cleanup();
		this._actionManager.cleanup();
		this._eventManager.removeAllListeners();
		this._currentSence = rootNode;
		rootNode.onEnter();
	},

	pause : function(){
		//TODO
		this._isPaused = true;
		this._eventManager.setEnabled(false);
	},

	stop : function(){
		//TODO
		this._isStopped = true;
		this._eventManager.setEnabled(false);
	},

	resume : function(){
		//TODO
	},

	run : function(){
		var _t = this;
		if(this._firstTick)
			this._isStopped = this._isPaused = this._firstTick = false;
		this._timeInfo = this._timer.getInfo();
		if(!this._isStopped && !this._isPaused)
			this.update();
		setTimeout(function(){_t.run.call(_t);},1000/this._globalFPS);
	}

});