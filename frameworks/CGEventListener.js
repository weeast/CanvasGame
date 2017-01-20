var cg = cg || {};

/********************************************
 *                事件监听器部分
 *******************************************/
cg.EventListener = cg.Class.extend({
	_onEvent: null, // 事件回调函数
	_type: 0,
	_listenerID: null,
	_registered: false, // 该事件是否被注册

	_fixedPriority: 0, //固定优先级
	_node: null, // 绑定到的节点
	_paused: false,
	_isEnabled: true,

	ctor: function(type, listenerID, callback) {
		this._onEvent = callback;
		this._type = type || 0;
		this._listenerID = listenerID || "";
	},

	/**
	 * 只有绑定到节点上的事件才能暂停，固定优先级的事件通过enabled来控制传递
	 * @param {boolean} paused
	 * @private
	 */
	_setPaused: function(paused) {
		this._paused = paused;
	},

	/**
	 * 检查事件是否被暂停
	 * @returns {boolean}
	 * @private
	 */
	_isPaused: function() {
		return this._paused;
	},

	/**
	 * 设置事件是否被注册
	 * @param {boolean} registered
	 * @private
	 */
	_setRegistered: function(registered) {
		this._registered = registered;
	},

	/**
	 * 检查事件是否被注册
	 * @returns {boolean}
	 * @private
	 */
	_isRegistered: function() {
		return this._registered;
	},

	/**
	 * 获取监听器类型
	 * @returns {number}
	 * @private
	 */
	_getType: function() {
		return this._type;
	},

	/**
	 *  获取监听器类型
	 * @returns {string}
	 * @private
	 */
	_getListenerID: function() {
		return this._listenerID;
	},

	/**
	 * 设置固定优先级，不能设置为0，0是为绑定节点事件专门设置的
	 * @param {number} fixedPriority
	 * @private
	 */
	_setFixedPriority: function(fixedPriority) {
		this._fixedPriority = fixedPriority;
	},

	/**
	 * 获取固定优先级
	 * @returns {number}
	 * @private
	 */
	_getFixedPriority: function() {
		return this._fixedPriority;
	},

	/**
	 * 设置事件绑定节点
	 * @param {cg.Node} node
	 * @private
	 */
	_setSceneGraphPriority: function(node) {
		this._node = node;
	},

	/**
	 * 获取事件绑定节点
	 * @returns {cg.Node}
	 * @private
	 */
	_getSceneGraphPriority: function() {
		return this._node;
	},

	/**
	 * 检查事件是否可用
	 * @returns {boolean}
	 */
	checkAvailable: function() {
		return this._onEvent != null;
	},

	/**
	 * 复制监听器，子类必须重载
	 * @returns {cg.EventListener}
	 */
	clone: function() {
		return null;
	},

	/**
	 *  设置事件是否可用
	 * @param {boolean} enabled
	 */
	setEnabled: function(enabled) {
		this._isEnabled = enabled;
	},

	/**
	 * 检查事件是否可用
	 * @returns {boolean}
	 */
	isEnabled: function() {
		return this._isEnabled;
	},
});

//事件监听器类型
cg.EventListener.UNKNOWN = 0;
cg.EventListener.TOUCH_ONE_BY_ONE = 1;
cg.EventListener.TOUCH_ALL_AT_ONCE = 2;
cg.EventListener.KEYBOARD = 3;
cg.EventListener.MOUSE = 4;
cg.EventListener.ACCELERATION = 5;
cg.EventListener.CUSTOM = 6;
cg.EventListener.EVENT_BEFORE_UPATE = 7;
cg.EventListener.EVENT_AFTER_UPATE = 8;
cg.EventListener.EVENT_AFTER_DRAW = 9;

//用户自定义类型
cg._EventListenerCustom = cg.EventListener.extend({
	_onCustomEvent: null,
	ctor: function(listenerId, callback) {
		this._onCustomEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onCustomEvent != null)
				selfPointer._onCustomEvent(event);
		};

		cg.EventListener.prototype.ctor.call(this, cg.EventListener.CUSTOM, listenerId, listener);
	},

	checkAvailable: function() {
		return (cg.EventListener.prototype.checkAvailable.call(this) && this._onCustomEvent != null);
	},

	clone: function() {
		return new cg._EventListenerCustom(this._listenerID, this._onCustomEvent);
	}
});

cg._EventListenerCustom.create = function(eventName, callback) {
	return new cg._EventListenerCustom(eventName, callback);
};
//鼠标事件
cg._EventListenerMouse = cg.EventListener.extend({
	onMouseDown: null,
	onMouseUp: null,
	onMouseMove: null,
	onMouseScroll: null,

	ctor: function() {
		var selfPointer = this;
		var listener = function(event) {
			var eventType = cg.EventMouse;
			switch (event._eventType) {
				case eventType.DOWN:
					if (selfPointer.onMouseDown)
						selfPointer.onMouseDown(event);
					break;
				case eventType.UP:
					if (selfPointer.onMouseUp)
						selfPointer.onMouseUp(event);
					break;
				case eventType.MOVE:
					if (selfPointer.onMouseMove)
						selfPointer.onMouseMove(event);
					break;
				case eventType.SCROLL:
					if (selfPointer.onMouseScroll)
						selfPointer.onMouseScroll(event);
					break;
				default:
					break;
			}
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.MOUSE, cg._EventListenerMouse.LISTENER_ID, listener);
	},

	clone: function() {
		var eventListener = new cg._EventListenerMouse();
		eventListener.onMouseDown = this.onMouseDown;
		eventListener.onMouseUp = this.onMouseUp;
		eventListener.onMouseMove = this.onMouseMove;
		eventListener.onMouseScroll = this.onMouseScroll;
		return eventListener;
	},

	checkAvailable: function() {
		return true;
	}
});

cg._EventListenerMouse.LISTENER_ID = "__cg_mouse";

cg._EventListenerMouse.create = function() {
	return new cg._EventListenerMouse();
};

cg._EventListenerTouchOneByOne = cg.EventListener.extend({
	_claimedTouches: null,
	swallowTouches: false,
	onTouchBegan: null,
	onTouchMoved: null,
	onTouchEnded: null,
	onTouchCancelled: null,

	ctor: function() {
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.TOUCH_ONE_BY_ONE, cg._EventListenerTouchOneByOne.LISTENER_ID, null);
		this._claimedTouches = [];
	},

	setSwallowTouches: function(needSwallow) {
		this.swallowTouches = needSwallow;
	},

	clone: function() {
		var eventListener = new cg._EventListenerTouchOneByOne();
		eventListener.onTouchBegan = this.onTouchBegan;
		eventListener.onTouchMoved = this.onTouchMoved;
		eventListener.onTouchEnded = this.onTouchEnded;
		eventListener.onTouchCancelled = this.onTouchCancelled;
		eventListener.swallowTouches = this.swallowTouches;
		return eventListener;
	},

	checkAvailable: function() {
		if (!this.onTouchBegan) {
			cg.log(cg._LogInfos._EventListenerTouchOneByOne_checkAvailable);
			return false;
		}
		return true;
	}
});

cg._EventListenerTouchOneByOne.LISTENER_ID = "__cg_touch_one_by_one";

cg._EventListenerTouchOneByOne.create = function() {
	return new cg._EventListenerTouchOneByOne();
};

cg._EventListenerTouchAllAtOnce = cg.EventListener.extend({
	onTouchesBegan: null,
	onTouchesMoved: null,
	onTouchesEnded: null,
	onTouchesCancelled: null,

	ctor: function() {
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.TOUCH_ALL_AT_ONCE, cg._EventListenerTouchAllAtOnce.LISTENER_ID, null);
	},

	clone: function() {
		var eventListener = new cg._EventListenerTouchAllAtOnce();
		eventListener.onTouchesBegan = this.onTouchesBegan;
		eventListener.onTouchesMoved = this.onTouchesMoved;
		eventListener.onTouchesEnded = this.onTouchesEnded;
		eventListener.onTouchesCancelled = this.onTouchesCancelled;
		return eventListener;
	},

	checkAvailable: function() {
		if (this.onTouchesBegan == null && this.onTouchesMoved == null && this.onTouchesEnded == null && this.onTouchesCancelled == null) {
			cg.log(cg._LogInfos._EventListenerTouchAllAtOnce_checkAvailable);
			return false;
		}
		return true;
	}
});

cg._EventListenerTouchAllAtOnce.LISTENER_ID = "__cg_touch_all_at_once";

cg._EventListenerTouchAllAtOnce.create = function() {
	return new cg._EventListenerTouchAllAtOnce();
};

cg._EventListenerBeforeUpdate = cg.EventListener.extend({
	_onLoopEvent: null,
	ctor: function(callback) {
		this._onLoopEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onLoopEvent != null)
				selfPointer._onLoopEvent(event);
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.EVENT_BEFORE_UPATE, cg._EventListenerBeforeUpdate.LISTENER_ID, listener);
	},
	checkAvailable: function() {
		return _onLoopEvent != null;
	}
});

cg._EventListenerBeforeUpdate.LISTENER_ID = "__cg_before_update";

cg._EventListenerBeforeUpdate.create = function() {
	return new cg._EventListenerBeforeUpdate();
};

cg._EventListenerAfterUpdate = cg.EventListener.extend({
	_onLoopEvent: null,
	ctor: function(callback) {
		this._onLoopEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onLoopEvent != null)
				selfPointer._onLoopEvent(event);
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.EVENT_AFTER_UPATE, cg._EventListenerAfterUpdate.LISTENER_ID, listener);
	},
	checkAvailable: function() {
		return _onLoopEvent != null;
	}
});

cg._EventListenerAfterUpdate.LISTENER_ID = "__cg_after_update";

cg._EventListenerAfterUpdate.create = function() {
	return new cg._EventListenerAfterUpdate();
};

cg._EventListenerAfterDraw = cg.EventListener.extend({
	_onLoopEvent: null,
	ctor: function(callback) {
		this._onLoopEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onLoopEvent != null)
				selfPointer._onLoopEvent(event);
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.EVENT_AFTER_DRAW, cg._EventListenerAfterDraw.LISTENER_ID, listener);
	},
	checkAvailable: function() {
		return _onLoopEvent != null;
	}
});

cg._EventListenerAfterDraw.LISTENER_ID = "__cg_after_draw";

cg._EventListenerAfterDraw.create = function() {
	return new cg._EventListenerAfterDraw();
};
/**
 * 使用json对象创建事件监听器
 * @function
 * @static
 * @param {object} argObj a json object
 * @returns {cg.EventListener}
 */
cg.EventListener.create = function(argObj) {

	cg.assert(argObj && argObj.event, cg._LogInfos.EventListener_create);

	var listenerType = argObj.event;
	delete argObj.event;
	var listener = null;
	if (listenerType === cg.EventListener.TOUCH_ONE_BY_ONE)
		listener = new cg._EventListenerTouchOneByOne();
	else if (listenerType === cg.EventListener.TOUCH_ALL_AT_ONCE)
		listener = new cg._EventListenerTouchAllAtOnce();
	else if (listenerType === cg.EventListener.MOUSE)
		listener = new cg._EventListenerMouse();
	else if (listenerType === cg.EventListener.CUSTOM) {
		listener = new cg._EventListenerCustom(argObj.eventName, argObj.callback);
		delete argObj.eventName;
		delete argObj.callback;
	} else if (listenerType === cg.EventListener.KEYBOARD)
		listener = new cg._EventListenerKeyboard();
	else if (listenerType === cg.EventListener.EVENT_BEFORE_UPATE) {
		listener = new cg._EventListenerBeforeUpdate(argObj.callback);
		delete argObj.callback;
	} else if (listenerType === cg.EventListener.EVENT_AFTER_UPATE) {
		listener = new cg._EventListenerAfterUpdate(argObj.callback);
		delete argObj.callback;
	} else if (listenerType === cg.EventListener.EVENT_AFTER_DRAW) {
		listener = new cg._EventListenerAfterDraw(argObj.callback);
		delete argObj.callback;
	}

	for (var key in argObj) {
		listener[key] = argObj[key];
	}

	return listener;
};