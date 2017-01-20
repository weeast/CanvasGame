var cg = cg || {};
/********************************************
 *                事件部分
 *******************************************/
cg.Event = cg.Class.extend({
	_type: 0,
	_isStopped: false,
	_currentTarget: null,

	_setCurrentTarget: function(target) {
		this._currentTarget = target;
	},

	ctor: function(type) {
		this._type = type;
	},

	/**
	 * 获取事件类型
	 * @function
	 * @returns {Number}
	 */
	getType: function() {
		return this._type;
	},

	/**
	 * 当前事件停止冒泡
	 * @function
	 */
	stopPropagation: function() {
		this._isStopped = true;
	},

	/**
	 * 当前事件是否停止冒泡
	 * @function
	 * @returns {boolean}
	 */
	isStopped: function() {
		return this._isStopped;
	},

	/**
	 * 获取当前事件冒泡位置，只有绑定在节点上的事件监听器才会有返回值，其他情况返回0
	 * @function
	 * @returns {cg.Node}  目标节点
	 */
	getCurrentTarget: function() {
		return this._currentTarget;
	}
});

//事件类型
cg.Event.TOUCH = 0;
cg.Event.KEYBOARD = 1;
cg.Event.ACCELERATION = 2;
cg.Event.MOUSE = 3;
cg.Event.CUSTOM = 4;
cg.Event.BEFORE_UPATE = 5;
cg.Event.AFTER_UPATE = 6;
cg.Event.AFTER_DRAW = 7;

//用户自定义事件
cg.EventCustom = cg.Event.extend({
	_eventName: null,
	_userData: null,

	ctor: function(eventName) {
		cg.Event.prototype.ctor.call(this, cg.Event.CUSTOM);
		this._eventName = eventName;
	},

	/**
	 * 设置事件数据
	 * @param {*} data
	 */
	setUserData: function(data) {
		this._userData = data;
	},

	/**
	 * 获取事件数据
	 * @returns {*}
	 */
	getUserData: function() {
		return this._userData;
	},

	/**
	 * 获取事件名称
	 * @returns {String}
	 */
	getEventName: function() {
		return this._eventName;
	}
});

//鼠标事件
cg.EventMouse = cg.Event.extend({
	_eventType: 0,
	_button: 0,
	_x: 0,
	_y: 0,
	_prevX: 0,
	_prevY: 0,
	_scrollX: 0,
	_scrollY: 0,

	ctor: function(eventType) {
		cg.Event.prototype.ctor.call(this, cg.Event.MOUSE);
		this._eventType = eventType;
	},

	/**
	 * 设置滚轮位置
	 * @param {number} scrollX
	 * @param {number} scrollY
	 */
	setScrollData: function(scrollX, scrollY) {
		this._scrollX = scrollX;
		this._scrollY = scrollY;
	},

	/**
	 * 获取滚轮x方向值
	 * @returns {number}
	 */
	getScrollX: function() {
		return this._scrollX;
	},

	/**
	 * 获取滚轮y方向值
	 * @returns {number}
	 */
	getScrollY: function() {
		return this._scrollY;
	},

	/**
	 * 设置鼠标位置
	 * @param {number} x
	 * @param {number} y
	 */
	setLocation: function(x, y) {
		this._x = x;
		this._y = y;
	},

	/**
	 * 获取鼠标位置
	 * @return {cg.Point} location
	 */
	getLocation: function() {
		return {
			x: this._x,
			y: this._y
		};
	},

	/**
	 * 获取鼠标在游戏场景中的位置
	 * @return {cg.Point}
	 */
	getLocationInView: function() {
		/*return {
			x: this._x,
			y: cg.view._designResolutionSize.height - this._y
		};
		*TODO
		**/
	},

	/**
	 * 设置鼠标之前的位置
	 * @param {number} x
	 * @param {number} y
	 */
	_setPrevCursor: function(x, y) {
		this._prevX = x;
		this._prevY = y;
	},

	/**
	 * 获取鼠标改变值
	 * @return {cg.Point}
	 */
	getDelta: function() {
		return {
			x: this._x - this._prevX,
			y: this._y - this._prevY
		};
	},

	/**
	 * 获取鼠标x改变值
	 * @return {Number}
	 */
	getDeltaX: function() {
		return this._x - this._prevX;
	},

	/**
	 * 获取鼠标y改变值
	 * @return {Number}
	 */
	getDeltaY: function() {
		return this._y - this._prevY;
	},

	/**
	 * 设置鼠标哪个键被点击
	 * @param {number} button
	 */
	setButton: function(button) {
		this._button = button;
	},

	/**
	 * 获取鼠标哪个键被点击
	 * @returns {number}
	 */
	getButton: function() {
		return this._button;
	},

	/**
	 * 获取鼠标x
	 * @returns {number}
	 */
	getLocationX: function() {
		return this._x;
	},

	/**
	 * 获取鼠标y
	 * @returns {number}
	 */
	getLocationY: function() {
		return this._y;
	}
});

//鼠标事件类型
cg.EventMouse.NONE = 0;
cg.EventMouse.DOWN = 1;
cg.EventMouse.UP = 2;
cg.EventMouse.MOVE = 3;
cg.EventMouse.SCROLL = 4;
cg.EventMouse.BUTTON_LEFT = 0;
cg.EventMouse.BUTTON_RIGHT = 2;
cg.EventMouse.BUTTON_MIDDLE = 1;
cg.EventMouse.BUTTON_4 = 3;
cg.EventMouse.BUTTON_5 = 4;
cg.EventMouse.BUTTON_6 = 5;
cg.EventMouse.BUTTON_7 = 6;
cg.EventMouse.BUTTON_8 = 7;

//触摸事件
cg.EventTouch = cg.Event.extend({
	_eventCode: 0,
	_touches: null,

	ctor: function(arr) {
		cg.Event.prototype.ctor.call(this, cg.Event.TOUCH);
		this._touches = arr || [];
	},

	/**
	 * 获取事件类型
	 * @returns {number}
	 */
	getEventCode: function() {
		return this._eventCode;
	},

	/**
	 * 获取触摸点
	 * @returns {Array}
	 */
	getTouches: function() {
		return this._touches;
	},

	_setEventCode: function(eventCode) {
		this._eventCode = eventCode;
	},

	_setTouches: function(touches) {
		this._touches = touches;
	}
});

//最大触摸点数
cg.EventTouch.MAX_TOUCHES = 5;

cg.EventTouch.EventCode = {
	BEGAN: 0,
	MOVED: 1,
	ENDED: 2,
	CANCELLED: 3
};